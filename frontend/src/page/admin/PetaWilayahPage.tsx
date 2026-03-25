import { AppSidebar } from "@/components/app-sidebar"
import {
  Map,
  MapControls,
  type MapRef,
  type MapViewport,
} from "@/components/ui/map"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState, useEffect, useRef } from "react"

const styles = {
  // default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
}

type StyleKey = keyof typeof styles

export default function PetaWilayahPage() {
  const mapRef = useRef<MapRef>(null)
  const [style, setStyle] = useState<StyleKey>("openstreetmap")
  const selectedStyle = styles[style]
  const is3D = style === "openstreetmap3d"

  const [viewport, setViewport] = useState<MapViewport>({
    center: [110.8371, -7.5703],
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 })
  }, [is3D])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-sidebar px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h2 className="font-bold">Peta Wilayah</h2>
        </header>
        <div className="flex flex-col p-4">
          <div className="relative h-100 w-full">
            <Map
              viewport={viewport}
              onViewportChange={setViewport}
              ref={mapRef}
              styles={
                selectedStyle
                  ? { light: selectedStyle, dark: selectedStyle }
                  : undefined
              }
              className="rounded-xl"
            >
            <MapControls
              position="bottom-right"
              showZoom
              showCompass
              showLocate
              showFullscreen
            />
            </Map>
            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border bg-background/80 px-2 py-1.5 font-mono text-xs backdrop-blur">
              <span>
                <span className="text-muted-foreground">lng:</span>{" "}
                {viewport.center[0].toFixed(3)}
              </span>
              <span>
                <span className="text-muted-foreground">lat:</span>{" "}
                {viewport.center[1].toFixed(3)}
              </span>
              <span>
                <span className="text-muted-foreground">zoom:</span>{" "}
                {viewport.zoom.toFixed(1)}
              </span>
              <span>
                <span className="text-muted-foreground">bearing:</span>{" "}
                {viewport.bearing.toFixed(1)}°
              </span>
              <span>
                <span className="text-muted-foreground">pitch:</span>{" "}
                {viewport.pitch.toFixed(1)}°
              </span>
            </div>
            <div className="absolute top-2 right-2 z-10">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as StyleKey)}
                className="rounded-md border bg-background px-2 py-1 text-sm text-foreground shadow"
              >
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="openstreetmap3d">OpenStreetMap 3D</option>
              </select>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
