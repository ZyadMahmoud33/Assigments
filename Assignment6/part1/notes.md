# Part 2: ERD - Musicana Records

Diagram: `erd.png` (Chen notation - entities as rectangles, relationships as diamonds, attributes as ovals, PK attributes underlined).

## Entities

- **MUSICIAN**: musician_id (PK), name, address (street, city), phone
- **INSTRUMENT**: name (PK), musical_key
- **ALBUM**: album_id (PK), title, copyright_date
- **SONG**: title (PK), author

## Relationships

- **PLAYS** (M:N) between MUSICIAN and INSTRUMENT — a musician can play several instruments, and an instrument can be played by several musicians.
- **PERFORMS** (M:N) between MUSICIAN and SONG — a song can be performed by one or more musicians, and a musician can perform many songs.
- **CONTAINS** (1:N) between ALBUM and SONG — each album has many songs, but a song belongs to exactly one album (so SONG holds the FK to ALBUM).
- **PRODUCES** (1:N) between MUSICIAN and ALBUM — every album has exactly one producer (a musician), and a producer can produce several albums (so ALBUM holds the FK for the producer musician_id).

## Why this design

- INSTRUMENT and SONG relate to MUSICIAN through many-to-many relationships (PLAYS, PERFORMS), so both need their own linking/junction logic when this gets mapped to relational tables (e.g. a `plays` table with musician_id + instrument_name, and a `performs` table with musician_id + song_title).
- ALBUM to SONG is one-to-many since a song can't be on more than one album — no junction table needed here, just a foreign key on SONG pointing to ALBUM.
- The producer relationship is also one-to-many but modeled as a second connection from MUSICIAN to ALBUM (separate from PLAYS/PERFORMS), since a musician's role as "producer" of an album is a different relationship than playing an instrument or performing a song.
