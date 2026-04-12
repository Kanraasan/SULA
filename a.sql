-- =============================================
-- CREATE LEADERBOARD TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL, -- Denormalized for quick access
    total_reports INTEGER DEFAULT 0,
    total_upvotes_received INTEGER DEFAULT 0, -- Total upvotes across all user's reports
    average_upvotes_per_report DECIMAL(5,2) DEFAULT 0,
    resolution_rate DECIMAL(5,2) DEFAULT 0, -- Percentage of resolved/completed reports
    rank_position INTEGER,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- CREATE INDEXES FOR LEADERBOARD
-- =============================================
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.leaderboard(rank_position);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_reports ON public.leaderboard(total_reports DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_upvotes ON public.leaderboard(total_upvotes_received DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);

-- =============================================
-- AUTO UPDATE UPDATED_AT TIMESTAMP
-- =============================================
CREATE TRIGGER update_leaderboard_updated_at
    BEFORE UPDATE ON public.leaderboard
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTION TO UPDATE LEADERBOARD STATISTICS
-- =============================================
CREATE OR REPLACE FUNCTION update_leaderboard_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_username VARCHAR(100);
    v_total_reports INTEGER;
    v_total_upvotes INTEGER;
    v_avg_upvotes DECIMAL(5,2);
    v_resolution_rate DECIMAL(5,2);
    v_total_resolved INTEGER;
BEGIN
    -- Determine which user to update based on the triggering table
    IF TG_TABLE_NAME = 'reports' THEN
        IF TG_OP = 'INSERT' THEN
            v_user_id := NEW.user_id;
        ELSIF TG_OP = 'DELETE' THEN
            v_user_id := OLD.user_id;
        ELSE
            v_user_id := NEW.user_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'report_upvotes' THEN
        IF TG_OP = 'INSERT' THEN
            SELECT user_id INTO v_user_id FROM public.reports WHERE id = NEW.report_id;
        ELSIF TG_OP = 'DELETE' THEN
            SELECT user_id INTO v_user_id FROM public.reports WHERE id = OLD.report_id;
        END IF;
    END IF;
    
    -- Get username
    SELECT username INTO v_username FROM public.users WHERE id = v_user_id;
    
    -- Calculate statistics
    SELECT 
        COUNT(*) INTO v_total_reports
    FROM public.reports 
    WHERE user_id = v_user_id;
    
    SELECT 
        COALESCE(SUM(upvotes), 0) INTO v_total_upvotes
    FROM public.reports 
    WHERE user_id = v_user_id;
    
    -- Calculate average upvotes per report
    IF v_total_reports > 0 THEN
        v_avg_upvotes := v_total_upvotes::DECIMAL / v_total_reports;
    ELSE
        v_avg_upvotes := 0;
    END IF;
    
    -- Calculate resolution rate (% of reports with status 'selesai')
    SELECT 
        COUNT(*) INTO v_total_resolved
    FROM public.reports 
    WHERE user_id = v_user_id AND status = 'selesai';
    
    IF v_total_reports > 0 THEN
        v_resolution_rate := (v_total_resolved::DECIMAL / v_total_reports) * 100;
    ELSE
        v_resolution_rate := 0;
    END IF;
    
    -- Insert or update leaderboard
    INSERT INTO public.leaderboard (
        user_id, 
        username, 
        total_reports, 
        total_upvotes_received, 
        average_upvotes_per_report, 
        resolution_rate,
        last_calculated_at
    ) VALUES (
        v_user_id,
        v_username,
        v_total_reports,
        v_total_upvotes,
        v_avg_upvotes,
        v_resolution_rate,
        NOW()
    ) ON CONFLICT (user_id) 
    DO UPDATE SET
        username = EXCLUDED.username,
        total_reports = EXCLUDED.total_reports,
        total_upvotes_received = EXCLUDED.total_upvotes_received,
        average_upvotes_per_report = EXCLUDED.average_upvotes_per_report,
        resolution_rate = EXCLUDED.resolution_rate,
        last_calculated_at = EXCLUDED.last_calculated_at,
        updated_at = NOW();
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS TO AUTO-UPDATE LEADERBOARD
-- =============================================
CREATE TRIGGER trigger_leaderboard_on_report_insert
    AFTER INSERT ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_stats();

CREATE TRIGGER trigger_leaderboard_on_report_delete
    AFTER DELETE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_stats();

CREATE TRIGGER trigger_leaderboard_on_report_update
    AFTER UPDATE OF status ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_stats();

CREATE TRIGGER trigger_leaderboard_on_upvote_insert
    AFTER INSERT ON public.report_upvotes
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_stats();

CREATE TRIGGER trigger_leaderboard_on_upvote_delete
    AFTER DELETE ON public.report_upvotes
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_stats();

-- =============================================
-- FUNCTION TO UPDATE RANK POSITIONS
-- =============================================
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS VOID AS $$
BEGIN
    UPDATE public.leaderboard l
    SET rank_position = ranked.rank
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (
                ORDER BY 
                    total_reports DESC, 
                    total_upvotes_received DESC,
                    resolution_rate DESC
            ) as rank
        FROM public.leaderboard
    ) ranked
    WHERE l.id = ranked.id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SCHEDULE RANK UPDATE (Run every hour via pg_cron)
-- =============================================
-- Uncomment if pg_cron extension is available
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- 
-- SELECT cron.schedule(
--     'update-leaderboard-ranks',  -- job name
--     '0 * * * *',                 -- every hour
--     'SELECT update_leaderboard_ranks();'
-- );

-- =============================================
-- VIEW FOR TOP LEADERBOARD (for quick access)
-- =============================================
CREATE OR REPLACE VIEW public.top_leaderboard AS
SELECT 
    user_id,
    username,
    total_reports,
    total_upvotes_received,
    average_upvotes_per_report,
    resolution_rate,
    rank_position,
    last_calculated_at
FROM public.leaderboard
WHERE total_reports > 0
ORDER BY rank_position NULLS LAST, total_reports DESC, total_upvotes_received DESC
LIMIT 100;

-- =============================================
-- FUNCTION TO GET USER RANK
-- =============================================
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS TABLE (
    rank INTEGER,
    total_reports INTEGER,
    total_upvotes INTEGER,
    resolution_rate DECIMAL
) AS $$
BEGIN
    -- Update ranks first to ensure fresh data
    PERFORM update_leaderboard_ranks();
    
    RETURN QUERY
    SELECT 
        l.rank_position::INTEGER,
        l.total_reports,
        l.total_upvotes_received,
        l.resolution_rate
    FROM public.leaderboard l
    WHERE l.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SAMPLE QUERIES FOR LEADERBOARD
-- =============================================

-- Get top 10 users by reports
-- SELECT * FROM top_leaderboard LIMIT 10;

-- Get user's current rank
-- SELECT * FROM get_user_rank('user-uuid-here');

-- Get leaderboard with user's rank position
-- SELECT 
--     user_id,
--     username,
--     total_reports,
--     total_upvotes_received,
--     resolution_rate,
--     rank_position
-- FROM public.leaderboard
-- ORDER BY rank_position NULLS LAST
-- LIMIT 50;

-- Get weekly top contributors
-- SELECT 
--     u.username,
--     COUNT(r.id) as reports_this_week
-- FROM public.users u
-- LEFT JOIN public.reports r ON u.id = r.user_id 
--     AND r.created_at > NOW() - INTERVAL '7 days'
-- GROUP BY u.id, u.username
-- ORDER BY reports_this_week DESC
-- LIMIT 10;