# EncryptDecrypt

Simple HTML page for encrypting and decrypting a file with a password.

## Warning

- For security reasons, this page works only with the https:,localhost: or file: protocols. 
- This page works with recent versions of Firefox and others recent browsers based on Chromium (Brave, Vivaldi...).

## Encrypting a file

- Select a file with the encrypt button.
- Gives a password. The password must be at least 12 characters long and contain at least one capital, one lowercase, one number, and one other character (all unicode characters are valid).
- Save the encrypted file.

## Decrypting a file

- Select a file with the decrypt button or type the file url (the url must uses the https: or localhost: protocol - This functionality is not enabled when EncryptDecrypt is launched with the file: protocol).
- Gives the password used for encryption.
- Save the decrypted file. JPEG, PNG, PDF and HTML files are directly opened in the browser.

## Lauch EncryptDecrypt and directly start decrypting a file

Add "?fil=" followed by the file url base 64 encoded to the EncryptDecrypt url. The url must uses the https protocol.

This functionality is not enabled when EncryptDecrypt is launched with the file: protocol.

When using this functionality, the encrypted file must uses the same protocol, the same host name and the same port than the app, so you can use a relative or absolute path.

You don't know how to encode to base 64? see [this](https://wwwouaiebe.github.io/base64/). Sources are [there](https://github.com/wwwouaiebe/base64).

Sample : [https://wwwouaiebe.github.io/EncryptDecrypt/demo?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9FbmNyeXB0RGVjcnlwdC9kZW1vL3NhbXBsZS5lbmM=](https://wwwouaiebe.github.io/EncryptDecrypt/demo?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9FbmNyeXB0RGVjcnlwdC9kZW1vL3NhbXBsZS5lbmM=)

The password is **(Mush1544room)**

## What if I forgott the password

No solution... put the file to the bin.

## Demo

Go to the [demo - en ](https://wwwouaiebe.github.io/EncryptDecrypt/demo)

## How to install

Simply download the project and copy the dist/index.html, dist/EncryptDecrypt.css and dist/EncryptDecrypt.min.js file to your computer or server.

### Perhaps some changes to do in the index.html file

Content Security policy is enabled with a meta tag in the index.html file:

```
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; script-src 'self'; connect-src 'self'">
```

It is better to enable Content Security Policy on your server than through a meta tag.

Because of the "connect-src 'self'" statement, it is not possible to decrypt a file that is on another server than the one where EncryptDecrypt is installed. You must modify this instruction, according to the rules of Content Security Policy.

It may be useful to add 'integrity' and 'crossorigin' attributes to the link and script tags.