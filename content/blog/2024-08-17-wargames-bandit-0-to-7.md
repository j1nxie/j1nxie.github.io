+++
title = "Wargames - Bandit (Levels 0 to 7)"

[taxonomies]
tags = ["wargames", "bandit", "ctf"]
+++

Well, here we are again, in the middle of the night - I am bored and I am preparing for [idekCTF 2024](https://ctf.idek.team). What's better than sitting and solving some more CTF stuff? I'm gonna start with [Bandit](https://overthewire.org/wargames/bandit/) - and go all the way up slowly as per the recommended order on the [Wargames homepage](https://overthewire.org/wargames/).

The first few levels (or Bandit itself, really) are really simple - mostly about teaching you about Unix/Linux utilities, and various other tools you might need while doing CTF challenges.

# Level 0

>  The goal of this level is for you to log into the game using SSH. The host to which you need to connect is **bandit.labs.overthewire.org**, on port 2220. The username is **bandit0** and the password is **bandit0**. Once logged in, go to the Level 1 page to find out how to beat Level 1.

Well, the idea is clear. Connect through SSH using:

```bash
$ ssh bandit0@bandit.labs.overthewire.org -p 2220
The authenticity of host '[bandit.labs.overthewire.org]:2220 ([13.50.165.192]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[bandit.labs.overthewire.org]:2220' (ED25519) to the list of known hosts.
                         _                     _ _ _
                        | |__   __ _ _ __   __| (_) |_
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_
                        |_.__/ \__,_|_| |_|\__,_|_|\__|


                      This is an OverTheWire game server.
            More information on http://www.overthewire.org/wargames

bandit0@bandit.labs.overthewire.org's password:
```

Fill in the given password at the prompt, and you're in!

# Level 0 -> Level 1

>  The password for the next level is stored in a file called **readme** located in the home directory. Use this password to log into bandit1 using SSH. Whenever you find a password for a level, use SSH (on port 2220) to log into that level and continue the game.

Simple enough! Let's use `cat` to read the file `readme`.

```bash
$ cat readme
Congratulations on your first steps into the bandit game!!
Please make sure you have read the rules at https://overthewire.org/rules/
If you are following a course, workshop, walthrough or other educational activity,
please inform the instructor about the rules as well and encourage them to
contribute to the OverTheWire community so we can keep these games free!

The password you are looking for is: {password}
```

A quick `exit` to get out, let's connect to level 1.

# Level 1 -> Level 2

> The password for the next level is stored in a file called **-** located in the home directory.

Alright, we got the password from the previous level. Let's connect in through SSH.

```bash
$ ssh bandit1@bandit.labs.overthewire.org -p 2220
```

At the password prompt, I will use the password I got from the previous level. The filename, as given by the problem, is `-` - a special character. I will still use `cat`, but escape the filename with a backslash `\` so `cat` properly understands the filename.

```bash
$ cat ./\-
{password}
```

We're done! Let's get out and move on to level 3.

# Level 2 -> Level 3

> The password for the next level is stored in a file called **spaces in this filename** located in the home directory.

Still a simple challenge. Anyone can `cat` files that have spaces in their names by wrapping the entire path in quotes. Let's give this a try.

```bash
$ cat "spaces in this filename"
{password}
```

We're done!

# Level 3 -> Level 4

> The password for the next level is stored in a hidden file in the **inhere** directory.

Hidden directories huh... Let's put ourselves into the `inhere` directory first, and try printing the directory listing.

```bash
$ cd inhere
~/inhere$ ls
```

Nothing. I know just the trick for this - the `-a` option for `ls`.

```bash
~/inhere$ ls -a
.  ..  ...Hiding-From-You
```

Aha. Let's `cat` out our password, and get out.

```bash
~/inhere$ cat ...Hiding-From-You
{password}
```

# Level 4 -> Level 5

> The password for the next level is stored in the only human-readable file in the **inhere** directory. Tip: if your terminal is messed up, try the “reset” command.

Let's start by `cd`ing into the `inhere` directory again. I will use the `file` command to see the types of the file - "human-readable" is a hint from the problem text.

```bash
$ cd inhere
~/inhere$ file ./*
./-file00: data
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
```

There's only one file with the type "ASCII text" - let's `cat` it!

```bash
~/inhere$ cat ./-file07
{password}
```

# Level 5 -> Level 6

> The password for the next level is stored in a file somewhere under the **inhere** directory and has all of the following properties:
> - human-readable
> - 1033 bytes in size
> - not executable

Let's try printing the directory listing.

```bash
$ cd inhere
~/inhere$ ls
maybehere00  maybehere02  maybehere04  maybehere06  maybehere08  maybehere10  maybehere12  maybehere14  maybehere16  maybehere18
maybehere01  maybehere03  maybehere05  maybehere07  maybehere09  maybehere11  maybehere13  maybehere15  maybehere17  maybehere19
```

Right... There's a lot of folders, and possibly files. But don't fret! A Linux utility is available for us to help us out with this - `find`.

```bash
~/inhere$ find .
# output too long, omitted here.
```

Dangit. That's a whole lot of files. Let's check the problem text and see the requirements. It has to be a human-readable file, and it has to be 1033 bytes in size. It also has to be non-executable, but we will skip that for now. `find` provides a few filters to help us out with this - `-type f` allows us to only search for files, skipping all directories, while `-size 1033c` filters out files with the precise size of 1033 bytes (yes, the `c` suffix is for bytes!). Let's see it in action.

```bash
~/inhere $ find . -type f -size 1033c
./maybehere07/.file2
```

Only one file - we can also do a few checks on the file to see if it matches up with the rest of the description.

```bash
~/inhere$ file ./maybehere07/.file2
./maybehere07/.file2: ASCII text, with very long lines (1000)
~/inhere$ ls -l ./maybehere07/.file2
-rw-r----- 1 root bandit5 1033 Jul 17 15:57 ./maybehere07/.file2
```

Yup, precisely what we wanted - ASCII text, 1033 bytes, and non-executable, by the lack of the `x` bit on the permissions. Let's `cat` it to see the content, and away we go!.

# Level 6 -> Level 7

> The password for the next level is stored somewhere on the server and has all of the following properties:
> - owned by user **bandit7**
> - owned by group **bandit6**
> - 33 bytes in size

Sounds like another `find`! Finding by user and group would be hard, but thankfully, `find` also provides us filters for all those operations! `-user <user>` and `-group <group>` filter files owned by that user and group, respectively!

```bash
$ find / -type f -size 33c -user bandit7 -group bandit6
# long output, omitted
find: ‘/etc/credstore.encrypted’: Permission denied
find: ‘/etc/ssl/private’: Permission denied
find: ‘/etc/credstore’: Permission denied
find: ‘/etc/xinetd.d’: Permission denied
find: ‘/etc/polkit-1/rules.d’: Permission denied
find: ‘/root’: Permission denied
find: ‘/tmp’: Permission denied
find: ‘/lost+found’: Permission denied
find: ‘/dev/shm’: Permission denied
find: ‘/dev/mqueue’: Permission denied
find: ‘/var/spool/bandit24’: Permission denied
find: ‘/var/spool/rsyslog’: Permission denied
find: ‘/var/spool/cron/crontabs’: Permission denied
find: ‘/var/lib/udisks2’: Permission denied
/var/lib/dpkg/info/bandit7.password
# long output, omitted
```

Amidst a sea of `permission denied`, we see a file that doesn't have that problem! Let's `cat` the file to see its content, and let's move on to the next level.

```bash
$ cat /var/lib/dpkg/info/bandit7.password
{password}
```
