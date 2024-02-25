---
title: hoshizora-parser
---

`hoshizora-parser` is a library meant for parsing the `.osu` file format, and it's the first time I have ever written a functional parser. It reads through a given `.osu` file, converted into a Rust `&str`.

Originally, I planned for this library to be its own separate crate, named `pippi-parser`, but as time went on, and I thought of the different first-party integrations it will be used in, the repository was reorganized into the `hoshizora` monorepo.

As this was the first time I wrote a parser of any sort, starting out with the parsing mechanism was a struggle for me. Each `.osu` file has the general structure of:

```
[Header]
key_01: value_01
key_02: value_02
```

After a while of thinking and discussing with others, I decided on parsing each line differently, depending on the current context of the parser. If the parser goes through a header line, it will switch its context, based on which header was received. This seems to be, overall, a very efficient parsing method for file formats with different headers and context like this one.
