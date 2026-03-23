# User API Spec

Ini API Spec buat gambaran aja sih, buat sementara sampe sini dulu. Aku mau lanjut belajar typescript lebih dalem lagi, ini aja hasil vibecoding backendnya :).

## Register User

Endpoint : POST /api/users

Request Body:

```json
{
  "NIK": 202020,
  "username": "Bond",
  "password": "71009",
  "passwordConfirm": "password",
  "kecamatan": "dataKecamatan",
  "kelurahan": "dataKelurahan",
  "alamatLengkap": "jln. blablabla"
}
```

Response Body (success):

```json
{
  "NIK": 202020,
  "username": "Bond",
  "password": "71009",
  "passwordConfirm": "password",
  "kecamatan": "dataKecamatan",
  "kelurahan": "dataKelurahan"
}
```

Response Body (failed):

```json
{
    if(passwordConfirm != password ){
        "error": "password tidak cocok",
    }

}

```

## Login User

Endpoint : POST /api/users

Request Body:

```json
{
  "NIK": 202020,
  "username": "Bond",
  "password": "71009",
  "rememberMe": true
}
```

Response Body (success):

```json
{
  "NIK": 202020,
  "username": "Bond",
  "password": "71009",
  "rememberMe": true
}
```

Response Body (Failed):

```json
{
  "errors": "please enter the right password/username"
}
```

## Get User

## Update User

## Logout User
