---
title: "PicoCTF 2024: Forensics"
date: 2024-08-01 18:00:00 +0700
categories: [blogs]
tags: ["picoctf", coding, ctf]
---

I have had interest in cyber security and CTF-related stuff for a while now, but I've never had the time to properly learn them. Given that SekaiCTF 2024 is starting soon, and my planned ideas edging closer to things related in this field, I will be trying to prepare for it and spend some time learning more about it! Thanks to Bottersnike's recommendations, I started doing PicoCTF's backlog of challenges to have a better grasp at this! In this post, I will be giving writeups for the forensics challenges as I go through them.

> This blogpost will describe the challenges and give the solutions to them - but I will not be giving out the flag in its entirety.

1. Table of Contents
{:toc}

# Verify

> **Difficulty**: Easy \
> **Categories**: grep, checksum

In this challenge, you're given a folder of encrypted files, the decryption script and the SHA-256 hash of the file you're looking for. On a Linux machine, it's a simple run of `sha256sum` on all the files in the folder, and `grep`ping for the given SHA-256 hash. Afterwards, running the decryption script on the file would give you the flag you're looking for.

# Scan Surprise

> **Difficulty**: Easy \
> **Categories**: shell, qrcode

As the name suggests, the challenge gives you a QR code. Simply scan the QR code using your mobile device, or convert it to text using just about any QR code to text converter, and you're good to go.

# Secret of the Polyglot

> **Difficulty**: Easy \
> **Categories**: file_format, polyglot

The challenge gives you a `.pdf` file. Attempting to open this file as-is gives you... half a flag? Where's the other part? Using `file` on the downloaded file gives you this:

```
$ file flag2of2-final.pdf
flag2of2-final.pdf: PNG image data, 50 x 50, 8-bit/color RGBA, non-interlaced
```

Hmm, that's weird. Let's try making it a PNG file and see what happens. Changing the file extension to `.png` and opening it with an image viewer yields the other half of the flag, and we're done!

> Loupe (GNOME's image viewer) gave me a hard time doing this - it kept recognizing the ending half of the file as `application/pdf` and refused to open the file, despite it having a `PNG` header and file extension. I had to download GIMP to open the file up to see the first half of the flag.

# CanYouSee

> **Difficulty**: Easy \
> **Categories**: none

This challenge gives you a `.zip` file, which contains a `.jpg` image inside. Opening the image doesn't *really* show anything that's irregular - no signs of steganography, at least, to the naked eye. Maybe there's something in the metadata? Using `exiftool` on the extracted `.jpg` gives us this:

```
$ exiftool ukn_reality.jpg
ExifTool Version Number         : 12.92
File Name                       : ukn_reality.jpg
Directory                       : .
File Size                       : 2.3 MB
File Modification Date/Time     : 2024:03:12 07:05:53+07:00
File Access Date/Time           : 2024:03:12 07:05:53+07:00
File Inode Change Date/Time     : 2024:08:01 18:15:46+07:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : inches
X Resolution                    : 72
Y Resolution                    : 72
XMP Toolkit                     : Image::ExifTool 11.88
Attribution URL                 : cGljb0NURntNRTc0RDQ3QV9ISUREM05fYjMyMDQwYjh9Cg==
Image Width                     : 4308
Image Height                    : 2875
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 4308x2875
Megapixels                      : 12.4
```

Ooh, the attribution URL looks interesting. That's a base64 encoded string! Let's try decoding this! There are many ways to do it, but I use Linux's `base64` utility as such:

```
$ echo "cGljb0NURntNRTc0RDQ3QV9ISUREM05fYjMyMDQwYjh9Cg==" | base64 -d
```

That gives us the flag for the challenge!

# Blast from the past

> **Difficulty**: Medium \
> **Categories**: metadata

An image is given by the challenge, and your task is to set all the timestamps to `1970:01:01 00:00:00.001+00:00` (that's one millisecond after the start of the Unix epoch!) with as much precision as possible. Using `exiftool` once again, we can set the majority of the dates using `exiftool "-AllDates=1970:01:01 00:00:00.001+00:00" original.jpg`. This comes with its downside - the subsecond creation date, original date/time and modify date will be off in the milliseconds. Once again, use `exiftool` to change those dates to match the precise timestamp. After this, submit the file to the checker program.

We've obtained the flag, that's done-- Until we haven't. You will see one last timestamp tag that we'll need to set - the Samsung: TimeStamp tag. This pesky timestamp is not writable through `exiftool`, so we'll need another tool for the job. But, just to be sure, let's run the file through `exiftool` one last time, but this time we'll increase the verbosity all the way up.

```
$ exiftool -v3 original.jpg
# a whole lot of metadata omitted...
Samsung trailer (143 bytes at offset 0x2b83ca):
  2b83ca: 00 00 01 0a 0e 00 00 00 49 6d 61 67 65 5f 55 54 [........Image_UT]
  2b83da: 43 5f 44 61 74 61 31 37 30 30 35 31 33 31 38 31 [C_Data1700513181]
  2b83ea: 34 32 30 00 00 a1 0a 08 00 00 00 4d 43 43 5f 44 [420........MCC_D]
  2b83fa: 61 74 61 33 31 30 00 00 61 0c 18 00 00 00 43 61 [ata310..a.....Ca]
  2b840a: 6d 65 72 61 5f 43 61 70 74 75 72 65 5f 4d 6f 64 [mera_Capture_Mod]
  2b841a: 65 5f 49 6e 66 6f 31 53 45 46 48 6b 00 00 00 03 [e_Info1SEFHk....]
  2b842a: 00 00 00 00 00 01 0a 57 00 00 00 23 00 00 00 00 [.......W...#....]
  2b843a: 00 a1 0a 34 00 00 00 13 00 00 00 00 00 61 0c 21 [...4.........a.!]
  2b844a: 00 00 00 21 00 00 00 30 00 00 00 53 45 46 54    [...!...0...SEFT]
  SamsungTrailer_0x0a01Name = Image_UTC_Data
  - Tag '0x0a01-name' (14 bytes):
    2b83d2: 49 6d 61 67 65 5f 55 54 43 5f 44 61 74 61       [Image_UTC_Data]
  TimeStamp = 1700513181420
  - Tag '0x0a01' (13 bytes):
    2b83e0: 31 37 30 30 35 31 33 31 38 31 34 32 30          [1700513181420]
  SamsungTrailer_0x0aa1Name = MCC_Data
  - Tag '0x0aa1-name' (8 bytes):
    2b83f5: 4d 43 43 5f 44 61 74 61                         [MCC_Data]
  MCCData = 310
  - Tag '0x0aa1' (3 bytes):
    2b83fd: 33 31 30                                        [310]
  SamsungTrailer_0x0c61Name = Camera_Capture_Mode_Info
  - Tag '0x0c61-name' (24 bytes):
    2b8408: 43 61 6d 65 72 61 5f 43 61 70 74 75 72 65 5f 4d [Camera_Capture_M]
    2b8418: 6f 64 65 5f 49 6e 66 6f                         [ode_Info]
  SamsungTrailer_0x0c61 = 1
  - Tag '0x0c61' (1 bytes):
    2b8420: 31                                              [1]
```

Oooh, we're seeing something! The Samsung: TimeStamp tag is stored in the file under hex - and it's simply the Unix timestamp in milliseconds! Using any hex editor - I use GHex for simplicity's sake, find the bytes shown in `exiftool`'s output: `31 37 30 30 35 31 33 31 38 31 34 32 30`, and edit it to be `30 30 30 30 30 30 30 30 30 30 30 30 31`, which is what we need the timestamp to be. Submitting the file one final time, and we're *finally* done with this one.

# Mob psycho

> **Difficulty**: Medium \
> **Categories**: apk

An `.apk` file. We all know these are glorified `.zip` files. Let's `unzip` this, and see what's inside. Unzipping the given APK, there's nothing *too* out of the ordinary for this directory structure. Everything is there, everything looks fine, so far nothing too special.

I am not going to scroll through and go into each directory to find files, so I'll just run a simple `find` in the directory. Scrolling through the results and... "`./res/color/flag.txt`? Is this it? Printing out the file content gives what looks like a hexadecimal string. Let's run this through a hexadecimal to ASCII converter aaaaand... there's our flag!

# endianess-v2

> **Difficulty**: Medium \
> **Categories**: none

The challenge gives us another weird file. Running `file` gives nothing, and it doesn't look like anything opens it up correctly either. It's time to take a look at it once again in a hex editor. GHex gives me a very interesting first line... `E0 FF D8 FF 46 4A 10 00 01 00 46 49 01 00 00 00`, the ASCII representation of which is `....FJ....FI....`. Wait... Isn't this the JFIF header but flipped? It looks like every four bytes is flipped around, if you compare it to the correct JFIF header: `FF D8 FF E0 .. .. 4A 46 49 46 00 ..` (of which `..` is some hex value). The block of `E0 FF D8 FF` is reversed, and so on for every other chunk of 4 bytes.

I guess it's time for a Python script or something, as rewriting this by hand is... basically impossible.

```python
import binascii

# open the files
with open("challengefile", "rb") as original_file:
    with open("solution", "wb") as new_file:
        # read the original file and get the hex values
        hex_data = original_file.read().hex()

        # create an array of 4-byte blocks
        hex_array = [hex_data[i:i+8] for i in range(0, len(hex_data), 8)]

        reversed_array = []

        # create an array with all the reversed strings
        for hex_string in hex_array:
            reversed_hex_string = "".join(reversed([hex_string[i:i+2] for i in range(0, len(hex_string), 2)]))
            reversed_array.append(reversed_hex_string)

        # join it all together
        reversed_string = "".join([reversed_array[i] for i in range(0, len(reversed_array))])

        # write it out to the file
        for i in range(0, len(reversed_string), 2):
            new_file.write(binascii.unhexlify(reversed_string[i:i+2]))
```

Not the cleanest Python code, I know. A quick check with `file` shows that we've got the file correctly:

```
$ file solution
solution: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 300x150, components 3
```

And opening it would result in our flag!

> There remains one more challenge unsolved - and that's Dear Diary - a disk image challenge. As of writing this post right now (August 1, 2024) I am too lazy to really go look at it, so this would be all my solutions for now. Thanks a ton to making through to the end!
