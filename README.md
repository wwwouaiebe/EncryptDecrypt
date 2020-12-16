# EncryptDecrypt

Simple HTML page for encrypting and decrypting a file with a password.

## Warning

- For security reasons, this page works only with the HTTPS protocol. 
- This page works with recent versions of Firefox and others recent browsers based on Chromium (Brave, Vivaldi...).
- This page don't work with the old versions of MS Edge because crypto functions are not correct in the old MS Edge.
The page works with the new MS Edge based on Chromium.


## Encrypting a file

- Select a file with the encrypt button.
- Gives a password.
- Save the encrypted file.

## Decrypting a file

- Select a file with the decrypt button or type the file url (the url must uses the https protocol).
- Gives the password used for encryption.
- Save the decrypted file. JPEG, PNG, PDF and HTML files are directly opened in the browser.

## Lauch EncryptDecrypt and directly start decrypting a file

add "?fil=" followed by the file url base 64 encoded to the EncryptDecrypt url. The url must uses the https protocol.

Sample : [https://wwwouaiebe.github.io/EncryptDecrypt/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9FbmNyeXB0RGVjcnlwdC9zYW1wbGUuZW5j](https://wwwouaiebe.github.io/EncryptDecrypt/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9FbmNyeXB0RGVjcnlwdC9zYW1wbGUuZW5j)

The password is (Mush1544room)

## What if I forgott the password

No solution... put the file to the bin.

## Demo

Go to the [demo - en ](https://wwwouaiebe.github.io/EncryptDecrypt/)

## How to install

Simply download the project and copy the dist/index.html, dist/EncryptDecrypt.css and dist/EncryptDecrypt.min.js file to your computer or server.

### Perhaps some changes to do in the index.html file

Content Security policy is enabled with a meta tag in the index.html file:

```
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; script-src 'self'; connect-src 'self'">
```

It is better to enable Content Security Policy on your server than through a meta tag.

Because of the "connect-src 'self'" statement, it is not possible to decrypt a file that is on another server
than the one where EncryptDecrypt is installed. You must modify this instruction, according to the rules of Content Security Policy.

It may be useful to add 'integrity' and 'crossorigin' attributes to the link and script tags, as was done in the demo (see source of the index.html in the gh-pages branch).

