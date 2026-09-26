# Jung, Archetypal Astrology, and the Design of a Depth-Psychological Astrology App

Jung took astrology seriously as a symbolic language of the psyche. He used horoscopes in his clinical work, but he never showed that it works as a causal or predictive science, and his own statistics did not support it. So the most defensible and most interesting foundation for your app is the one his lineage actually built: the chart as a mirror for reflection, imagination and individuation, not a forecast of fate.

## TL;DR

- **Jung's position was real but ambivalent.** He studied astrology from at least 1911 ("my evenings are taken up very largely with astrology"). In 1947 he said he "usually" got a horoscope "in cases of difficult psychological diagnosis." He explained astrology as projection of the collective unconscious and as synchronicity, not stellar causation. His marriage-horoscope experiment was, by his own reckoning, "nothing but a chance result from the statistical point of view."
- **The lineage turned his ideas into a practice.** Rudhyar (1936), Greene and Sasportas (the Centre for Psychological Astrology, founded in 1983), Arroyo, Howell, Hamaker-Zondag, and then Tarnas, Grof and Le Grice (archetypal cosmology) made the chart a map of complexes, shadow and typology. They made transits a way of timing individuation, read through myth rather than prediction. Controlled tests (Carlson 1985 in *Nature*; Dean & Kelly 2003) do not support astrology's factual claims, so the honest frame is meaning-making.
- **The app opportunity is depth plus play plus ethics.** Existing apps split into two kinds. Some are feed-and-notification products (Co–Star, The Pattern). Others are editorial, calculation or learning tools (CHANI, TimePassages, Astro.com). None fully builds in the Jungian loop of chart → image → dialogue → journal → integration. Build on accurate ephemerides (Swiss Ephemeris needs AGPL compliance or a paid licence), frame everything as invitations rather than verdicts, and design against fatalism and dependency.

---

## Key Findings

1. **Documented fact:** Jung practised and wrote about astrology for about fifty years. The primary sources are the Freud letters (1911), the Wilhelm memorial (1930), the seminars (1928–30), the Raman (1947) and Barbault (1954) letters, *Synchronicity* (1952) and *Aion* (1951).
2. **Documented fact:** His theory of *why* astrology works changed over time. He moved from "libido symbols" (1911) to projection of the unconscious (1930s), then to "qualitative time", then (by 1954) explicitly to synchronicity. Rossi and Le Grice note that he "even shifts his position on explanations of astrology within the space of a single chapter."
3. **Documented fact:** Jung's marriage experiment (483 couples) did not produce statistically significant results, and Jung said so. Popular claims that it "confirmed astrology" are wrong.
4. **Lineage pattern:** Jung never mapped his four functions onto the four elements. Arroyo and Greene did (Fire = intuition, Earth = sensation, Air = thinking, Water = feeling), and this mapping has become canonical in psychological astrology: Astrodienst's *Psychological Horoscope Analysis* builds it in, with Alois Treindl explaining in 1987 that "these four types correspond to the four elements fire, water, earth, and air."
5. **Evidence:** The best-known controlled tests found astrologers performed at chance. The critiques and counter-analyses by astrologers are real, but they are marginal and contested.
6. **Clinical reality:** Some therapists already use astrology with consenting clients. The main risks named in the literature are magical transference, fatalism, dependency and working beyond one's competence.
7. **App gap:** No mainstream app puts active imagination, dream work, synchronicity journaling and shadow dialogue at its centre, with the chart as a prompt rather than an oracle.

---

## Part 1 — Jung's Own Views and Practice

### 1.1 The primary record

**The Freud correspondence (1911).** In May 1911 Jung told Freud that astrology "seems indispensable for a proper understanding of mythology." On 12 June 1911 he wrote: "My evenings are taken up very largely with astrology. I make horoscopic calculations in order to find a clue to the core of psychological truth. Some remarkable things have turned up which will certainly appear incredible to you… I dare say that we shall one day discover in astrology a good deal of knowledge that has been intuitively projected into the heavens. For instance, it appears that the signs of the zodiac are character pictures, in other words, libido symbols which depict the typical qualities of the libido at a given moment." This is Jung's earliest theory: the zodiac as a typology of psychic energy. Rossi and Le Grice note that his occult interests, astrology among them, were "a contributory factor in his professional and personal break from Freud in early 1913."

**"Richard Wilhelm: In Memoriam" (1930, CW 15).** Here Jung wrote that astrology's value "is obvious enough to the psychologist, since astrology represents the sum of all the psychological knowledge of antiquity." The same memorial is the usual source for his statement of the qualitative-time idea: "whatever is born or done at this particular moment of time has the quality of this moment of time." That idea later grew into synchronicity.

**Seminars (1928–1930).** In the *Dream Analysis* seminar (27 November 1929), Jung said: "In 1929 everything has the cast and brand of this year. And the children born in this year will be recognisable as part of a great process." The *Visions* seminar (19 November 1930) is widely quoted as calling astrology "the projected psychology of the unconscious." That wording comes to us through secondary compilations.

**Letter to B. V. Raman (6 September 1947, Letters I, pp. 475–476).** This is the most-cited evidence of clinical use: "In cases of difficult psychological diagnosis I usually get a horoscope in order to have a further point of view from an entirely different angle. I must say that I very often found that the astrological data elucidated certain points which I otherwise would have been unable to understand." He went on: "Astrology is of particular interest to the psychologist, since it contains a sort of psychological experience which we call 'projected'… This originally gave rise to the idea that these factors derive from the stars, whereas they are merely in a relation of synchronicity with them." He also criticised the field: "What I miss in astrological literature is chiefly the statistical method by which certain fundamental facts could be scientifically established." The letter was later printed as an appendix to Raman's *Astrology and Modern Thought*. (One Springer encyclopedia entry dates a Raman letter to June 1948. Either there was a second letter or the date is a citation discrepancy; the 1947 letter is the canonical one in *Letters I*.)

**Letter to André Barbault (26 May 1954, Letters II, pp. 175–177).** This is Jung's most careful late statement. He says early experiences owe their pathogenic effect partly to "the psychic predisposition, i.e., to heredity, which seems to be expressed in a recognizable way in the horoscope. The latter apparently corresponds to a definite moment in the colloquy of the gods, that is to say the psychic archetypes." Asked about qualitative time and transits, he says: "This is a notion I used formerly but I have replaced it with the idea of synchronicity," which he likens to the ancient *sympatheia* and to Leibniz's pre-established harmony.

**Letter to Hans Bender (10 April 1958, Letters II, p. 428).** "It is indeed very difficult to explain the astrological phenomenon. I am not in the least disposed to an either-or explanation… with a psychological explanation there is only the alternative: either *and* or!" This is the clearest statement of his refusal to settle the question.

### 1.2 The astrological marriage experiment (CW 8, *Synchronicity*, 1952)

The *design* comes straight from the text. Jung tested what he called the traditional marriage correspondences, "the conjunctio Solis et Lunae, the conjunctio Lunae et Lunae, and the conjunction of the moon with the ascendent." He counted conjunctions and oppositions among Sun, Moon, Mars, Venus, Ascendant and Descendant, which gave fifty aspects in total, using an 8° orb. The horoscopes came from "friendly donors in Zurich, London, Rome, and Vienna," and he worked with Dr. Liliane Frey-Rohn. The data came in three batches: "two more batches of 220 and 83 marriages were added to the original batch [of 180], so that, in all, 483 marriages, or 966 horoscopes, were examined." The control group was 32,220 unmarried pairings (180 × 179).

The results were suggestive at first. "The most frequent aspect in the first was a sun-moon conjunction (10%), in the second a moon-moon conjunction (10.9%), and in the third a moon-Asc. conjunction (9.6%)". In other words, each batch "hit" a different classical marriage aspect. In the first batch, woman's Moon conjunct man's Sun appeared 18 times against 8.4 in the controls. The physicist Markus Fierz worked out probabilities of about 1:1000, 1:10,000 and 1:50. But the average maxima dropped from batch to batch (8.1% → 7.7% → 5.6%). Jung admitted that errors in his calculations "all tend to exaggerate the results in a way favorable to astrology."

**Jung's own conclusion** was that the average frequency "is far from representing a significant figure… there is no ground for assuming that our maximum frequencies are more than mere dispersions due to chance." And: "It is nothing but a chance result from the statistical point of view, yet it is meaningful… It is just what I call a synchronistic phenomenon." He put the pattern down to the experimenters' psychology: "both my co-worker and myself had a lively interest in the outcome… a secret, mutual connivance existed between the material and the psychic state of the astrologer". He added that "the entire experiment was carried out on only one subject, myself," who was "at first enthusiastic, but afterwards cools off." Michael Fordham's editorial preface to the Collected Works describes it as an "astrological experiment in which no correlation was statistically significant."

**How it has been judged since.** The editors of *Jung on Astrology* (Rossi & Le Grice, 2018) left out the statistics altogether. They call the experiment "ill-conceived" and "notable primarily for its methodological flaws and statistical errors." Robert Palter's early review (*Philosophy of Science*, 1956) was sceptical, and Geoffrey Dean published "A Re-Assessment of Jung's Astrological Experiment" in *Correlation* (1995/96). Roderick Main notes that the figures "do not exceed the kind of dispersions that might be expected due to chance," although combining the batches can yield nominal significance. Recent scholarship (Zeng, *International Journal of Jungian Studies*, 2024; *Journal of Analytical Psychology*, 2025) argues that Jung kept the failed statistics in the essay to show that synchronicity has to be approached through experience, not proof. Zeng also argues that post-Jungians such as Greene and Tarnas passed over Jung's caution.

**A popular misreport to flag:** some widely read summaries, including Wikipedia's "Astrological compatibility" article, claim that Jung "found a correlation between the married couples that matched astrological prediction" and "repeated the experiment with the same results." That is not what Jung reported.

**Design lesson for the app:** the experiment is a gift. It is a story in which the founder of depth psychology tests astrology, gets a null result, and concludes that the *meaning* was in the relationship between observer and symbol. That is exactly the stance a reflective app should take.

### 1.3 *Aion* (1951) and the astrological ages

In *Aion* (CW 9ii), Jung reads the precession of the equinoxes as a symbolic history of the Western God-image. The spring point entered Pisces around the start of the Christian era. So Christ, the "fish" with fishermen for disciples and fishes that multiplied, "was born as the first fish of the Pisces era and was doomed to die as the last ram of the declining Aries era." The two fishes of Pisces become Christ and Antichrist, and the second fish lines up with the Renaissance and the rise of the modern spirit, an *enantiodromia*. He placed the start of the Aquarian aeon "between A.D. 2000 and 2200" depending on the starting point chosen. In a letter he called 1940 "the premonitory earthquake of the New Age." He expected Aquarius to "constellate the problem of the union of opposites," in which evil could no longer be written off as a mere *privatio boni*.

Jung himself hedges: "no connection of any kind can be proved between the figure of Christ and the inception of the astrological age of the fishes." Treat *Aion* as mythic hermeneutics, not astronomical chronology.

### 1.4 Jung's teachers and his own chart

Liz Greene's archival study, *Jung's Studies in Astrology* (Routledge, 2018), draws on unpublished material in Jung's private archives. It shows that his contemporary sources were mainly the Theosophical astrologer Alan Leo and Max Heindel. Jung apparently enrolled in Heindel's Rosicrucian correspondence course in astrology. He also relied on astrologers such as John M. Thorburn (who drew Jung's natal chart in 1928) and on colleagues such as Liliane Frey-Rohn (who drew his progressed chart for 1939–40). In the widely told account, Toni Wolff is linked to the start of his astrological interest. His daughter Gret Baumann-Jung became an astrologer herself and published "Some Reflections on the Horoscope of C. G. Jung" (*Spring*, 1975). Greene reports that Jung recommended that anyone training as a psychotherapist should learn astrology. That claim rests on her archival reading.

A small but telling detail: Jung's birth time is uncertain. He was born "when the last rays of the setting sun lit the room," and recorded times range from about 7:24 to 7:41 pm local time, which changes the Midheaven. Even the founding chart comes with error bars.

### 1.5 Documented versus overstated claims

| Claim | Status |
|---|---|
| Jung studied astrology seriously from 1911 onward | **Documented** (Freud letters) |
| He used horoscopes "in cases of difficult psychological diagnosis" | **Documented** (Raman letter); how *often* is unclear, and "usually" refers to difficult cases, not all patients |
| "Astrology represents the sum of all the psychological knowledge of antiquity" | **Documented** (CW 15, Wilhelm memorial, 1930) |
| His marriage experiment proved astrology | **False**; Jung called the result statistically chance |
| He believed planets cause character | **False**; he explicitly rejected causation in favour of projection/synchronicity, while staying open ("either *and* or") |
| "Like vintage years of wine, we have the qualities of the year… in which we are born" | **Widely attributed, poorly sourced**; it circulates on quote sites without a verified primary citation. It matches his qualitative-time idea but should not be quoted as verbatim Jung |
| He mapped the four functions to the four elements | **False attribution**; Arroyo and Greene did; Jung "didn't pursue the typological correlation to astrology" (Rossi & Le Grice) |
| He required trainee analysts to learn astrology | **Reported** by Greene from archival sources; not in the Collected Works |

### 1.6 Related Jungian concepts the app will need

- **Archetypes and the collective unconscious:** universal patterns that show up as images. Jung wrote that the planets are "the gods, symbols of the power of the unconscious."
- **Synchronicity:** acausal, meaningful coincidence, worked out with Wolfgang Pauli. It is the theoretical bridge between chart and life, and it is inherently *experiential*.
- **Individuation and the Self:** becoming whole, with the Self as centre and totality. The book *Jung on Astrology* has a section titled "Mandalas, birth charts, and the self". The circular chart is a natural mandala.
- **Psychological types:** attitudes (introversion and extraversion) and functions (thinking, feeling, sensation, intuition), with a "superior" and an "inferior" function.
- **Shadow:** what is disowned and projected. Psychological astrology links it strongly with Saturn.
- **Anima/animus:** contrasexual images, which psychological astrologers often read through Moon/Venus and Sun/Mars. This is an area where modern gender assumptions need updating.
- **Active imagination:** conscious dialogue with images and figures from the unconscious. This is the key practice for an interactive app.
- **Alchemy:** stages of transformation (*nigredo*, *albedo*, *rubedo*), with Saturn/lead as the *prima materia*.
- **The I Ching:** Jung's foreword to the Wilhelm translation is the classic statement of divination as synchronicity. He treated astrology in *Synchronicity* as one of several "mantic methods".

---

## Part 2 — The Lineage: From Jung to Archetypal Cosmology

Rossi and Le Grice identify three ways Jungian ideas entered astrology:
- as a guide to psychological interpretation;
- as an emphasis on development rather than prediction;
- as a theory of why astrology might work.

That triad is a useful map of the figures below.

### 2.1 Dane Rudhyar (1895–1985) — humanistic, then transpersonal

*The Astrology of Personality* (1936) reformulated astrology "in terms of contemporary psychology and philosophy", drawing on Jung, holism and Theosophy. In this view the stars do not cause anything. They are pictures synchronistically aligned with a person's development, and the person keeps the freedom to respond. Rudhyar founded the International Committee for Humanistic Astrology in 1969, and by the mid-1970s he had moved on to "transpersonal astrology." His lasting contributions are the birth chart as "a map of potential," the lunation cycle as a model of phases, and his reinterpretation of the Sabian Symbols (1973). Arroyo's preface says the restructuring of astrology "began with Dane Rudhyar's The Astrology of Personality in 1936." Greene found that Jung owned Rudhyar's first book.

**How he works:** the chart is a seed, and life cycles are phases of unfolding (the waxing and waning of any planetary pair). **App relevance:** phase-based thinking, where every cycle has a "new moon" and a "full moon", is intuitive, playful and not deterministic.

### 2.2 Stephen Arroyo — energy, elements and counselling

*Astrology, Psychology and the Four Elements* (1975), which won the British Astrological Association's Astrology Prize, presents astrology as "a language of energy". It treats the elements as "the vital energies inherent in all life processes", compares Jung with other psychologists, and rejects the "fatalism and negativity of old-fashioned astrology." Arroyo was among the first to link Jung's types to the elements and to discuss astrology "in the counseling arts." In his view, modern people have "lost touch with the archetypal foundation of [their] being," and astrology can be "a way of reuniting man with his innermost self."

### 2.3 Liz Greene and Howard Sasportas — the Centre for Psychological Astrology

Greene holds a doctorate in psychology and a Diploma in Analytical Psychology (Association of Jungian Analysts, London, 1980). She also holds a counselling diploma from the Centre for Transpersonal Psychology. Sasportas had an MA in Humanistic Psychology and trained in psychosynthesis and at the Centre for Transpersonal Psychology. Their classes began informally in 1980. They were grouped in 1982 as the "Centre for Transpersonal Astrology" and renamed the **Centre for Psychological Astrology (CPA)** in 1983, "because a wide variety of psychological approaches was incorporated… ranging from transpersonal psychology to the work of Jung, Freud, and Klein." After Sasportas died in 1992, Charles Harvey co-directed the Centre until his death in 2000.

- ***Saturn: A New Look at an Old Devil* (1976)** recast the "Greater Malefic" as the shadow and the teacher. "We may thus infer from the placement of Saturn that area where the shadow will express itself most readily, where one is perhaps the most defensive and critical of others."
- ***Relating* (1977)** is the core text on typology: "Jung's four function types fit hand in glove with astrology's ancient division of the four elements… each is a distinct way of describing the empiric observations of the same phenomena."
- ***The Development of the Personality* (Greene & Sasportas, 1987)** is a CPA seminar volume on how the chart describes childhood, parental images and the growth of the ego. It is the ancestor of "family complex" readings.
- **Computer reports:** from 1985 Greene worked with Alois Treindl of Astrodienst, a Swiss physicist, on computer-generated interpretations; in Greene's words, the aim was for "the computer to be programmed to synthesise horoscope factors according to an 'expert system' rather than the usual linear, non-synthesised interpretations." The *Psychological Horoscope Analysis* launched in 1987 and is still sold on Astro.com. This is the closest thing yet to a mass-market Jungian astrology product, and it is a direct precedent for your app.

**How they work:** the chart is a map of complexes and inner conflicts, planets are inner figures, the outer-planet transits are thresholds, and the sessions draw on counselling skills.

### 2.4 Alice O. Howell and Karen Hamaker-Zondag — Jungian analysts as astrologers

Howell (*Jungian Symbolism in Astrology*) called the birth chart "in potentia, a treasure map to the individuation process or greater awareness of the Self… The chart will impel us unconsciously, as do our complexes, until we become more conscious." She read Saturn paired with other planets as the "seven deadly sins" or, "psychologically expressed, one of the repressed or suppressed complexes." Hamaker-Zondag, a Dutch Jungian analyst and astrologer, wrote in depth on the correspondence between the elements and the types, including the "inferior function" as a doorway to the unconscious. **App relevance:** Howell's "the chart will impel us… until we become more conscious" is the ideal one-line product philosophy. The pattern is unconscious compulsion that turns into conscious choice.

### 2.5 Robert Hand, Erin Sullivan and Demetra George

- **Robert Hand** wrote *Planets in Transit* (1976), the standard psychologically informed transit reference, and is one of the "new generation of psychologically informed astrologers" whom Tarnas lists as coming to Esalen. He later helped lead the recovery of Hellenistic and medieval astrology. Hand added dates to Jung's Pisces scheme.
- **Erin Sullivan** (a CPA-affiliated author) is known for work on Saturn in transit and on retrogrades and the inner life. She treats transits as developmental rites of passage.
- **Demetra George** began with mythological and goddess-centred work (asteroids, the dark Moon) and moved into Hellenistic astrology. She is a bridge between myth-rich psychological astrology and ancient technique.

(I did not verify specific claims about these three against primary sources in this round, so treat these summaries as orientation.)

### 2.6 Richard Tarnas and Stanislav Grof — archetypal astrology

Tarnas lived at Esalen from 1974 to 1984, where he was director of programs, and wrote his doctorate with Grof. His account: "we discovered, to our utter astonishment, that the most reliable indicator of the kinds of experiences that people would have when they were undergoing major psychological transformations or non-ordinary states of consciousness… was transits to the natal chart. No other method of psychological testing, such as the MMPI or the Rorschach or TAT, had proved of any value for that purpose." He began studying Esalen residents and visitors in 1976 and "did hundreds of analyses." He has taught at CIIS since 1993, founding its Philosophy, Cosmology, and Consciousness program. His books are *Prometheus the Awakener* (1995, on Uranus) and *Cosmos and Psyche* (2006), which follows world transits such as Uranus–Pluto (revolutionary eras) and Saturn–Pluto (crisis and contraction) through cultural history. His thesis: "Between the astronomical and human is an archetypally informed synchronicity." He acknowledges that astrology is today "the gold standard of superstition."

Grof tied his basic perinatal matrices to outer-planet archetypes: BPM I to Neptune, BPM II to Saturn, BPM III to Pluto and BPM IV to Uranus. Trained practitioners now use transits to time Holotropic Breathwork and to help integrate psychedelic experiences. Critics, including the independent commentator Kevin R. D. Shepherd, call these correlations "impossible to prove".

**Key method features:**
- Planets are *multivalent* archetypes that are "archetypally predictive, not concretely predictive". The theme can be anticipated but not the specific event.
- The approach emphasises **orbs and aspects** (especially the "hard" aspects).
- It tracks transits to the natal chart, world transits and personal transits side by side.

### 2.7 James Hillman — archetypal psychology's ambivalent ally

Hillman seldom wrote about astrology directly. The key exception is an unpublished lecture, "Heaven Retains Within Its Sphere Half of All Bodies and Maladies" (Cycles and Symbols III, Isis Institute, San Francisco, February 1997; repeated in Bath in 2005). In it he affirmed a fifty-year interest in astrology and described it as an innately archetypal art. His strongest line: "Each time an astrological consultation can return a characteristic to its divine character, polish a problem so it shines in a different light, reveal the God in the disease… the astrologer is performing an epistrophé, returning a mess in the human to a myth in the Gods." Hillman's broader method is to personify, to pathologise (honouring symptoms), to see through literalism, and to practise a "polytheistic" psychology of many inner figures. That makes him the natural patron of an app that lets planets *speak*. His son Laurence Hillman is a practising archetypal astrologer. Accounts of the lecture describe it as "very clear on literalism". I could not verify a verbatim Hillman sentence on the point, but it fits his whole corpus.

### 2.8 Marie-Louise von Franz — number and time

Von Franz, Jung's closest collaborator on synchronicity, developed the idea of number as an archetype of order that links psyche and matter, notably in *Number and Time*. *Jung on Astrology* has chapters on "Number and archetypes" and "Acausal orderedness and the unus mundus," which cover this ground. She reported that Jung wondered whether "Mercurius" had played a trick on him in the marriage experiment. That is a nicely playful framing of a null result.

### 2.9 Keiron Le Grice, *Archai*, Pacifica and CIIS

In 2007 about 70 scholars, most of them CIIS Philosophy, Cosmology, and Consciousness faculty and graduates, formed the Archetypal Research Collective. In 2008–09 *Archai: The Journal of Archetypal Cosmology* launched under Le Grice and Rod O'Neal, and Le Grice suggested the name "archetypal cosmology" for the field. Le Grice (*The Archetypal Cosmos*) chairs the Jungian and Archetypal Studies specialization at Pacifica Graduate Institute and co-founded the Institute of Transpersonal and Archetypal Studies (ITAS) in 2016. Safron Rossi, also at Pacifica, co-edited *Jung on Astrology* and teaches Hillman-based astrology webinars for the CPA. Becca Tarnas teaches at CIIS.

### 2.10 Other psychological lineages worth knowing

- **The Huber Method:** Bruno and Louise Huber, Switzerland, founded 1962, drawing on Assagioli's psychosynthesis.
- **Glenn Perry:** the Graduate Institute's MA in archetypal cosmology (2009) and published writing on astrology-and-psychotherapy ethics.
- **Brian Clark:** Astro*Synthesis, Australia, with essays on Jung and the astrological timepiece.
- **Evolutionary astrology:** Jeff Green and Steven Forrest, adjacent but more karmic and reincarnational in framing.

### 2.11 How the lineage uses astrology in practice

| Function | What it looks like | Key sources |
|---|---|---|
| **Map of the psyche** | Planets as inner figures/complexes; signs as styles; houses as fields of life; aspects as inner relationships and conflicts | Greene, Howell, Hillman |
| **Typology** | Element balance → superior and inferior functions; "missing element" as shadow territory | Arroyo, Greene, Hamaker-Zondag |
| **Shadow work** | Saturn, Pluto, 12th house, oppositions as projection axes; synastry as mutual projection | Greene (*Saturn*, *Relating*), Howell |
| **Timing individuation** | Saturn return (~29 and ~58), Uranus opposition (~40–42, "midlife"), Saturn opposition (~44), Chiron return (~50), outer-planet transits as thresholds | Hand, Sullivan, Greene, Tarnas |
| **Mythic/narrative frame** | Amplifying placements with myth; "which god is in this symptom?" | Hillman, Howell, Rossi |
| **Timing depth work** | Transits used to anticipate the themes of holotropic or psychedelic sessions | Grof, Tarnas |
| **Collective history** | World transits and cultural epochs; astrological ages | Jung (*Aion*), Tarnas |

---

## Part 3 — Astrology in Therapeutic and Counselling-Adjacent Settings

### 3.1 Current practice

- **Clients bring it in.** A small Edinburgh study (*Spica*, 2013) surveyed 21 counsellors and psychotherapists, and 19 replied. Most professed some belief in astrology and reported clients bringing astrological beliefs into sessions. Therapists' training and orientation shaped how they responded, and even non-believers saw value in helping clients integrate their beliefs.
- **Clinician training is emerging.** In 2026, continuing-education providers are offering courses such as "Astrology-Assisted Therapy (AAT)" (Cascadia Training). These frame astrology as "a structured symbolic language" used "collaboratively and with client consent," with a focus on "meaning-making, narrative identity, relational patterns" rather than prediction. Tina Vitolo, LCSW, argues in *The Black Sheep Therapist* that no professional ethics code prohibits using such modalities when a client asks for them.
- **Consultation versus therapy.** Glenn Perry distinguishes counselling astrology (focused on problems, brief, from one to about a dozen sessions) from psychotherapy (an ongoing relationship aimed at changing self-defeating patterns). He warns about "boundaries of competence" when astrology clients want long-term work.

### 3.2 The tensions

1. **Fatalism vs. growth.** The whole lineage defines itself *against* fatalism: Rudhyar's potential, Arroyo's rejection of "fatalism and negativity," Howell's "until we become more conscious." But charts can easily be heard as verdicts ("my Saturn means I'll never be loved").
2. **Projection and magical transference.** Astrology "can create a magical transference with the client seeing the therapist as the one who knows all and has the 'Magic Pill'" (BAVA). Jung's own theory turns this round: the chart *is* a projection surface, which is useful if it is worked with consciously and harmful if it is taken literally.
3. **Dependency.** Daily transits and notifications can train people to hand decisions over to the sky. This matters especially for anxious or obsessive clients.
4. **Clinical contraindications.** Presenting astrological information "may not be appropriate with certain clients suffering from mental disorders such as chronic depression, schizophrenia, paranoia" (BAVA). The concern is ideas of reference and grandiosity or doom.
5. **The empirical evidence.**
   - **Carlson (1985, *Nature* 318:419–425).** The design was a double-blind test agreed in advance with the National Council for Geocosmic Research. 28 astrologers held in high esteem by their peers tried to match natal charts to California Psychological Inventory (CPI) profiles. The astrologers had predicted at least 50% success; chance was 33%. They performed at chance. Carlson concluded that "we are now in a position to argue a surprisingly strong case against natal astrology as practised by reputable astrologers." Suitbert Ertel's 2009 reanalysis found marginal significance (p = .054; ES = .15) when first and second choices were counted together in Test #1, and p = .04 (ES = .10) in Test #2, according to the astrology journal *Correlation*. Critics also note that the subjects could not reliably pick their *own* CPI profiles either.
   - **Dean & Kelly (2003, *Journal of Consciousness Studies* 10(6–7):175–198).** Their "time twins" test used 2,101 people born in London in early March 1958 and measured more than 100 variables. It "found no hint of the similarities predicted by astrology." Their meta-analysis of more than forty controlled studies involving over 700 astrologers found astrologers "unable to perform significantly better than chance." Astrologers counter that the full time-twin data has never been published in full.
   - **Jung's own experiment** was, by his own reckoning, chance.
   - **Bottom line:** the evidence does not support astrology as a predictive or diagnostic instrument. That does *not* rule out its value as a projective and reflective tool, much as Tarot or the TAT can be valuable. But the app must never imply that it has validity it does not have.

### 3.3 Connections to your background (transpersonal hypnotherapy → counselling)

- **Shared lineage.** Psychological astrology grew up *inside* the transpersonal movement:
  - Greene and Sasportas both trained at London's Centre for Transpersonal Psychology.
  - Sasportas trained in psychosynthesis, and the Huber method is based on Assagioli.
  - The CPA began life as the "Centre for Transpersonal Astrology."
  - Tarnas and Grof's archetypal astrology developed alongside Holotropic Breathwork.
  - Le Grice co-founded the Institute of Transpersonal and Archetypal Studies.
- **Active imagination and hypnotic imagery are cousins.** Guided dialogue with a "Saturn figure" is structurally close to parts work and to ego-state and imagery techniques in hypnotherapy. This is powerful, and it needs care.
- **Suggestibility is the key ethical risk.** Astrological content delivered in trance, or in any highly suggestible state, can plant expectations ("Pluto is transiting — expect loss"). Keep astrological framing out of induction and deepening, and treat it as client-led material only.
- **Scope of practice.** As you move into licensed counselling:
  - Astrology should be a client-requested, informed-consent adjunct.
  - It should be clearly documented as a meaning-making exercise, never a diagnosis.
  - It should be kept separate from assessment and treatment planning, unless your jurisdiction and supervisor explicitly allow it.
  - In an app context, you must not market the product as therapy or mental-health treatment.

---

## Part 4 — Implications for App Design

### 4.1 What existing apps do, and where they fall short

| App | What it does well | Gap relative to a depth approach |
|---|---|---|
| **Co–Star** | Real ephemeris data ("NASA data"), social chart comparison, a distinctive blunt voice; Co–Star's own claim of "over 30 million registered users" by summer 2023 (reported by Business Insider; Statista puts US active users at 450,000) | Algorithmic, feed-and-notification model; users criticise the "AI generated" feel; one-line directives ("don't waste energy on…") encourage outsourcing judgement; little depth after a few weeks |
| **The Pattern** | Psychologically worded, emotionally resonant readings; cycles; relationship features | Opaque method (it hides the astrology); aggressive subscription and cancellation flows in user reviews; "you are…" statements that invite Barnum-effect identification |
| **Sanctuary** | Live human astrologer chat | Pay-per-session upsell; readings in a single conversation, with no ongoing integration |
| **CHANI** | Human-written, ethically framed content; meditations, journaling, rituals; teaches the craft; sliding-scale access | Strongest precedent for reflective framing, but centred on content, not an interactive dialogue with *your* archetypes; limited depth-psychology tooling |
| **TimePassages** | Technical depth: full charts, aspects, transits, progressions | A professional-grade calculator with interpretation text; not designed for reflection or integration |
| **Astro.com (Astrodienst)** | The most trusted free calculation site; Liz Greene's *Psychological Horoscope Analysis* and related reports | Actual Jungian content, but static, long-form PDFs; no journaling, dialogue or follow-up over time |

**The gap:** nobody closes the loop. Jungian work is iterative: **symbol → association → amplification → dialogue (active imagination) → embodiment/ritual → noticing (synchronicity/dreams) → integration**. Current apps stop at the first step, "symbol", and deliver it as an answer.

### 4.2 Conceptual building blocks

**Core astrological layer (accurate and transparent):**
- **Planets as archetypes/inner figures.** Each gets a Jungian face (e.g., Saturn: Senex, shadow, teacher; Moon: mother complex and body; Venus/Mars: the eros/assertion polarity and the anima/animus projections), a mythic library and a Hillman-style "voice."
- **Signs as styles.** Element (type function) plus modality (cardinal, fixed, mutable, which Arroyo calls "centrifugal," "centripetal," "spiralic").
- **Houses as fields of life.** Be clear that the house system is a choice (Placidus, Whole Sign, etc.) and that birth-time uncertainty matters.
- **Aspects as inner relationships.** Conjunction = fusion, square = friction and growth, opposition = projection axis, trine = gift and complacency.
- **Transits and progressions** as a timing layer for *themes*, with orbs, duration and phases (applying, exact, separating), and Rudhyar-style cycle phases.
- **Life-cycle thresholds.** Saturn returns, the Uranus opposition, Chiron return and so on, framed as rites of passage.
- **Collective sky.** Current world transits (Tarnas) and the astrological ages (*Aion*), as the "cultural weather" alongside the personal.

**Jungian/depth layer:**
- **Typology module.** Element balance → a *hypothesis* about superior and inferior functions, which the user confirms or refutes. Keep it separate from MBTI and the 16-types trademarks, and note that Jung never made this mapping himself.
- **Shadow work.** Prompts about projection ("Who irritates you right now? What quality do they carry?"), linked to Saturn, Pluto and oppositions, *always offered as questions*.
- **Active imagination.** Guided dialogues in which the user speaks with a planetary figure. This is where AI-assisted conversation can shine, if it holds strict guardrails (see 4.4).
- **Dream journal.** Dreams tagged by symbol, cross-referenced over time with transits the user has chosen to track. The user notices correlations; the app does not assert them.
- **Synchronicity journal.** Log meaningful coincidences and see them against the sky. Jung's own experiment shows how such patterns can be meaningful without being statistical, and the app should say so openly.
- **Myth and symbol library.** Amplifications drawn from Greek, Roman, Mesopotamian, alchemical and world myth. The app should be culturally careful and credit its sources.
- **Alchemical stages** as a vocabulary for process (*nigredo* in a Saturn transit, *solutio* in a Neptune transit).
- **I Ching / "mantic moment" mode.** A chart cast for *now* when the user asks a question, framed as Jung framed divination: a mirror of the moment's quality.
- **Mandala view.** The chart presented as a mandala of the Self, which users can colour, annotate and redraw.

### 4.3 Where to be playful and interactive

- **"Council of the planets."** Stage a dialogue between conflicting inner figures (e.g., Moon square Saturn: the needy child and the stern elder negotiate). This is Hillman's polytheism made into a game.
- **"Which god is in this symptom?"** The user describes a problem, and the app offers two or three archetypal lenses to try on. Hillman's *epistrophé* as a feature.
- **Transit "seasons," not forecasts.** A Saturn transit becomes a months-long "quest" with chapters, rituals and reflection checkpoints. The Rudhyar phase model turns time into a story arc.
- **Mythic storytelling.** Retellings of the relevant myth, personalised to the user's own placements.
- **Synchronicity scavenger hunts.** Weekly symbol-noticing challenges (e.g., during a Mercury-themed week, notice messengers, crossroads, tricksters).
- **The "Mercurius trick."** Use Jung's null-result experiment as a lore card that teaches epistemic humility with humour.
- **Relationship mirrors.** Synastry framed as *mutual projection* ("what do you each carry for the other?"), not compatibility scores.
- **Collective weather.** Shared journaling around world transits, with gentle, opt-in community features.

### 4.4 Ethical design principles

1. **Reflection, not prediction.** Every interpretation is phrased as a question or possibility: "this may show up as…", "you might explore…". Use no event predictions, especially about health, death, pregnancy, legal matters or money.
2. **Epistemic honesty.** Include an accessible "What is this, really?" page covering Jung's views, the null results (Carlson, Dean & Kelly, and Jung's own experiment), and the app's stance: a symbolic language for self-reflection with no demonstrated predictive validity. Honesty is a differentiator for the thoughtful audience you want.
3. **Anti-dependency.** Do not use daily push-notification hooks or imperative directives. Encourage spacing between sessions and measure engagement by depth (journal entries, reflections) rather than daily opens. Include "close the app and go live this" endings.
4. **User authority.** The user confirms or rejects interpretations, and the app learns their personal symbol dictionary. Jung treated the chart as "a further point of view," never the final word.
5. **Safety rails for AI dialogue.**
   - Detect crisis language and hand off to real resources.
   - Never diagnose.
   - Never tell a user that a transit "causes" their depression.
   - Refuse fatalistic framings.
   - Avoid sycophantic "specialness" inflation, the grandiosity risk.
   - Be transparent that responses are generated.
6. **Not therapy.** State clearly that the app is not a clinical service. If you later offer clinician features, build consent, documentation and scope-of-practice controls.
7. **Birth-data privacy.** Birth date, time and place are sensitive, identifying data. Minimise it, encrypt it, never sell it, and allow deletion.
8. **Fair monetisation.** Avoid the cancellation traps criticised in reviews of The Pattern. Consider CHANI's sliding-scale model.
9. **Cultural and gender care.** Update anima/animus and Venus/Mars language beyond binaries. Credit the myths' cultures of origin. Note that Western tropical astrology is one tradition among many.

### 4.5 Data, ephemerides and licensing

- **Swiss Ephemeris (Astrodienst)** is the industry standard. It is based on NASA JPL's DE431/DE441 ephemerides and adds house systems, ayanamsas, fixed stars and asteroids. It is **dual-licensed**:
  - **AGPL-3.0:** the "obligation to place [your] whole software project under the AGPL or a compatible license", and this covers network-served software.
  - **Professional licence:** Astrodienst's current price list shows "Professional Edition unlimited license 700.00 CHF", and its June 2026 licence contract confirms "an unlimited license at CHF 700.-"; the CHF 750 / 400 / 1550 tiers appear only in older swisseph documentation. It is valid for 99 years, is a one-time fee, and does not allow you to use the Astrodienst or author names in promotion without permission.
  - Prices can change, so check the current price list before buying.
  - For a closed-source commercial app, budget for the professional licence. It is modest.
- **Alternatives:** permissively licensed engines (several vendors now market Apache-2.0 engines checked against JPL Horizons), commercial astrology APIs, or computing positions directly from JPL data. Evaluate their accuracy, house-system support and licence terms yourself. Vendor comparisons are marketing material.
- **Birth-time uncertainty:** build rectification-lite features and "time-unknown" modes (e.g., solar or whole-sign charts that de-emphasise houses and angles). Jung's own chart shows why.
- **Interpretive content licensing:** Greene's reports, and texts by Arroyo, Hand, Tarnas and others, are copyrighted. Write original content, license it, or cite with permission. Jung's Collected Works translations are also copyrighted (Princeton/Routledge), so use short quotes with attribution.

---

## Recommendations

1. **Position the app as "archetypal reflection," in the Jung → Greene → Tarnas → Hillman line.** Explicitly *not* a fortune-telling app. That is both more truthful and a clear differentiator from Co–Star and The Pattern.
2. **Make the core loop interactive.** Chart symbol → personal association → mythic amplification → active-imagination dialogue → journal → later review ("what did this season teach you?").
3. **Lead with three flagship features:**
   - **Inner Council** (planetary-figure dialogues);
   - **Transit Seasons** (life-cycle quests with a start, middle and end);
   - **Synchronicity and Dream Journal** (user-observed patterns shown against the sky).
4. **Put typology in with humility.** Offer element balance as a hypothesis about types, and let users test it against their lived experience.
5. **Publish an evidence-and-ethics page** that covers Jung's null experiment, Carlson and Dean & Kelly. Use it as a trust feature.
6. **Engineer against dependency**: no fear-based notifications, invitational language everywhere, and features that encourage offline integration.
7. **Licence Swiss Ephemeris professionally**, or choose a permissively licensed engine, *before* launch.
8. **Use your clinical background as governance, not marketing.** Write the app's safety protocols (crisis handoffs, contraindication-aware language, no trance-state astrological suggestion if you ever add guided audio). Keep your counselling practice and the app legally separate.

## Caveats

- Some Jung quotations circulate mainly through secondary compilations, astrology blogs and quote sites. Where possible I have tied them to CW or *Letters* citations via Rossi & Le Grice's *Jung on Astrology* and Liz Greene's archival study. The "vintage wine" line is not verified.
- Liz Greene is both the leading scholar of Jung's astrology and its leading practitioner-heir, so her archival claims (e.g., that Jung recommended astrology to trainee therapists) come from an interested party. They should be checked against the archival material where possible.
- Paragraph numbers for *Synchronicity* differ between editions (1952 German, 1955 English, CW 8), and some figures were revised.
- The summaries of Hand, Sullivan, George, Hamaker-Zondag and von Franz are orientation-level and were not checked against their primary texts in this round.
- App-market claims (user numbers, review complaints) come from third-party review blogs, some run by competitors. Treat them as directional.
- The empirical literature is contested at the margins (e.g., Ertel's reanalysis of Carlson), but no robust replicated evidence supports astrological prediction.

## Open Questions for Designing the App

1. **Ontology stance:** do we present astrology as synchronicity (Jung, Tarnas), as a pure projective and imaginal tool (Hillman), or leave it to users to choose among "lenses"? A "choose your lens" setting could itself be playful.
2. **Zodiac and technique:** tropical only, or a toggle for sidereal/Vedic? Modern planets plus Chiron only, or traditional rulerships as well? Which house system is the default?
3. **AI's role:** how far should generated dialogue go? Who writes the archetypal "voices", and how do we keep them consistent, myth-literate and safe?
4. **Content authorship:** do we write an original archetype and myth library, license an existing psychological astrologer's content, or commission Pacifica/CIIS-trained writers?
5. **Typology instrument:** do we build an optional Jungian-type self-assessment to compare with the chart's element balance? How do we avoid MBTI trademark and validity issues?
6. **Social layer:** should synastry be framed entirely as projection work? Do we include friends at all, given the dependency and comparison dynamics seen in Co–Star?
7. **Clinician mode:** is there a future professional version for therapists (consent forms, session notes, shareable client journals)? What regulatory exposure does that bring?
8. **Measurement:** what does "success" mean? Candidate metrics include reflective depth, self-reported insight, and reduced reliance over time, rather than daily active users.
9. **Guided audio:** given your hypnotherapy background, do we offer guided active-imagination audio? If so, what script standards prevent suggestive, fatalistic content during absorbed states?
10. **Collective features:** how do we present world transits and the "Aquarian age" without drifting into apocalyptic or grandiose narratives?