+++
title = "PicoCTF 2024: Cryptography"

[taxonomies]
tags = ["picoctf", "coding", "ctf", "cryptography"]
+++

Time to dig down the cryptography challenges! This is probably one of my favorite categories too, as my girlfriend is a huge cryptography enjoyer and it tickles our brains.

> Same thing with web and forensics, this blogpost will describe the challenges and give the solutions to them - but I will not be giving out the flag in its entirety.

1. Table of Contents
{:toc}

# interencdec

> **Difficulty**: Easy \
> **Categories**: base64, caesar

A file is given to you, with a base64 encoded string. I will once again use Linux's `base64` utility:

```
$ echo "YidkM0JxZGtwQlRYdHFhR3g2YUhsZmF6TnFlVGwzWVROclh6YzRNalV3YUcxcWZRPT0nCg==" | base64 -d
b'd3BqdkpBTXtqaGx6aHlfazNqeTl3YTNrXzc4MjUwaG1qfQ=='
```

Well... another base64 string? Let's do it again!

```
$ echo "d3BqdkpBTXtqaGx6aHlfazNqeTl3YTNrXzc4MjUwaG1qfQ==" | base64 -d
wpjvJAM{jhlzhy_k3jy9wa3k_78250hmj}
```

We have what looks like a ROT13'd flag string. Knowing that the flag is always in the format of `picoCTF{flag}`, I opened up my trusty Swiss Army Knife for cyber security stuff, [CyberChef](https://gchq.github.io/CyberChef/) and used ROT13 Brute Force on it. Typing in the known part of `picoCTF` and we got our flag!

# rsa_oracle

> **Difficulty**: Medium \
> **Categories**: none

Oh, RSA, my beloved... The challenge gives us a ciphertext, which I assume is the flag we're supposed to decrypt, and an encoded password. There's also an oracle we can use to poke around for things.

Alrighty, let's talk RSA. This is gonna be a long solve - strap in.

## What is RSA?

RSA is one of the oldest cryptosystem used for securing data. In simple terms, RSA can be summarized as below, without going too into details about *how* the keypair is generated.

- A pair of keys are generated, one *public* key and one **private** key.
- The *public* key has two parts - a modulus `n` and a public exponent `e`.
- The **private** key has the private exponent `d`.
- To encrypt:

    $$c = m^e \ (\text{mod}\ n)$$

- To decrypt:

    $$m = c^d \ (\text{mod}\ n)$$

Something to note - the public exponent `e` that is commonly used is 65537.

## Testing the waters

With that said, let's try plugging in 2 into the oracle, and see what it spits out for us.

```
$ nc titan.picoctf.net <port>
*****************************************
****************THE ORACLE***************
*****************************************
what should we do for you?
E --> encrypt D --> decrypt.
E
enter text to encrypt (encoded length must be less than keysize): 2
2

encoded cleartext as Hex m: 32

ciphertext (m ^ e mod n) 4707619883686427763240856106433203231481313994680729548861877810439954027216515481620077982254465432294427487895036699854948548980054737181231034760249505
```

So we do know the ciphertext for a given plaintext. I was originally going to try and calculate `n` and `d` for the RSA keys, but I realized we can do a chosen ciphertext attack on this oracle, and see how things goes.

## Chosen ciphertext attack

Based on [this answer](https://crypto.stackexchange.com/a/2331) on StackExchange, we can understand a chosen ciphertext attack as such:

1. Choose a certain plaintext such as `2`, and calculate:

    $$C \equiv 2^e \ \text{mod} \ n$$

2. We have the password as our original `C`, so we'll send over `C_b = C_a * C`, so:

    $$C_b \equiv C \times 2^e \equiv t^e 2^e \ \text{mod} \ n$$

3. We decrypt `C_b`:

    $$(C_b)^d \equiv (t^e 2^e)^d = [(t^e)^d \times (2^e)^d] \ \text{mod} \ n$$

4. For any plaintext `x`, we have `C = x^e` and `x = C^d`, so the above equation becomes:

    $$(C^b)^d \equiv (t \times 2) \ \text{mod} \ n$$

Finally, after all of this, what this means is that, if we have the encrypted password, and the encrypted ciphertext of `2`, we can multiply them together, send it to the oracle for decryption, and the result will be double of the decrypted password that we're looking for - in other words, halving this value will give us the decrypted password.

## Sending our decryption requests

I will use a quick and dirty Python script, along with the excellent [`pwntools`](https://github.com/Gallopsled/pwntools) library to send our requests and get the password.

```py
from pwn import *

# create a remote connection to the instance, replace <port> with your instance's port
conn = remote("titan.picoctf.net", port)

# read until the end of the prompt
conn.recvuntil("decrypt.")

# read the encrypted password to a variable
with open("password.enc") as password_file:
    c_a = int(password_file.read())

# encrypting plaintext 2
conn.sendline(b"E")
conn.recvuntil("keysize): ")
conn.sendline(b"\x02")
conn.recvuntil(b"mod n) ")

# reading the ciphertext for 2 to a variable
c_b = int(conn.recvline())

# decrypting c_b * c_a as described in the method above
conn.sendline(b"D")
conn.recvuntil(b"decrypt: ")
conn.sendline(str(c_b * c_a).encode())
conn.recvuntil(b"mod n): ")

# convert the receiving value from hex to int, and integer dividing it by 2 to obtain the password ciphertext
password = int(conn.recvline(), 16) // 2
password = password.to_bytes(len(str(password)) - 7).decode("utf-8")

# we're done!
print(password)
```

After this, all we need to do is use `openssl` to decrypt `secret.enc`:

```
$ openssl aes-256-cbc -d -in secret.enc
enter AES-256-CBC decryption password:
*** WARNING : deprecated key derivation used.
Using -iter or -pbkdf2 would be better.
picoCTF{flag}
```
