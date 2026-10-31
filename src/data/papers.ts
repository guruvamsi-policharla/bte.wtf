/**
 * The bibliography behind bte.wtf.
 *
 * To add a paper, append one object to `papers` below (order does not matter;
 * the site sorts newest first). See CONTRIBUTING.md for the conventions.
 * Every field must be checkable against the paper itself or its ePrint page.
 */

/** Allowed tags. Add a new one here if no existing tag fits. */
export const TAGS = [
  "mempool-privacy",
  "epochless",
  "silent-setup",
  "transparent-setup",
  "dkg",
  "weighted",
  "batched-ibe",
  "pairings",
  "implementation",
] as const;

export type Tag = (typeof TAGS)[number];

/**
 * How the committee's keys are set up.
 * - "trusted": a trusted dealer samples the keys.
 * - "mpc": an interactive setup beyond a plain DKG (e.g. secure multiplications).
 * - "dkg": a distributed key generation protocol.
 * - "silent": no interaction; parties only publish keys to a PKI.
 */
export type SetupKind = "trusted" | "mpc" | "dkg" | "silent";

/**
 * Optional scheme-level properties, intended for a future comparison table.
 * Values are short human-readable strings (asymptotics or concrete sizes) as
 * stated by the paper. Leave a field out rather than guess.
 */
export interface SchemeProperties {
  setup?: SetupKind;
  /** True if the scheme does not need per-epoch (per-batch) setup or indexing. */
  epochless?: boolean;
  /** Size of a single ciphertext, e.g. "|G1| + |GT|". */
  ciphertextSize?: string;
  /** Size of one server's partial decryption for a whole batch, e.g. "1 G1 element". */
  partialDecryptionSize?: string;
  /** Cost to combine partial decryptions and decrypt a batch of B ciphertexts. */
  decryptionCost?: string;
  /** Size of the public parameters, e.g. "O(B)". */
  publicParameterSize?: string;
  /** Hardness assumptions or idealized models the security proof relies on. */
  assumptions?: string[];
}

export interface PaperLinks {
  /** IACR ePrint landing page, e.g. "https://eprint.iacr.org/2024/669". */
  eprint?: string;
  pdf?: string;
  /** Full DOI URL, e.g. "https://doi.org/10.1145/...". */
  doi?: string;
  /** Public implementation, if the authors released one. */
  code?: string;
}

export interface Paper {
  /** Short unique slug, used as the URL anchor. We use alpha-style citation keys, e.g. "cgpp24". */
  id: string;
  title: string;
  /** Full author names, in the order printed on the paper. */
  authors: string[];
  /** Year the paper first appeared (for ePrint papers, the ePrint year). */
  year: number;
  /** Peer-reviewed venue including its year, e.g. "USENIX Security 2024". Omit for preprints. */
  venue?: string;
  links: PaperLinks;
  tags: Tag[];
  /** One sentence, plain text. */
  summary?: string;
  scheme?: SchemeProperties;
}

export const papers: Paper[] = [
  {
    id: "cgpp24",
    title: "Mempool Privacy via Batched Threshold Encryption: Attacks and Defenses",
    authors: ["Arka Rai Choudhuri", "Sanjam Garg", "Julien Piet", "Guru-Vamsi Policharla"],
    year: 2024,
    venue: "USENIX Security 2024",
    links: {
      eprint: "https://eprint.iacr.org/2024/669",
      pdf: "https://eprint.iacr.org/2024/669.pdf",
    },
    tags: ["mempool-privacy", "implementation"],
    summary:
      "Introduces batched threshold encryption, decrypting a batch of B transactions with O(n) rather than O(nB) committee communication, and discusses pitfalls of using plain threshold encryption for mempool privacy.",
  },
  {
    id: "cgpw24",
    title: "Practical Mempool Privacy via One-time Setup Batched Threshold Encryption",
    authors: ["Arka Rai Choudhuri", "Sanjam Garg", "Guru-Vamsi Policharla", "Mingyuan Wang"],
    year: 2024,
    links: {
      eprint: "https://eprint.iacr.org/2024/1516",
      pdf: "https://eprint.iacr.org/2024/1516.pdf",
    },
    tags: ["mempool-privacy", "dkg"],
    summary:
      "A practical scheme with a one-time DKG setup in which each decryption server communicates O(1) per batch, while keeping unselected transactions private.",
    scheme: {
      setup: "dkg",
      partialDecryptionSize: "O(1)",
    },
  },
  {
    id: "bfoq24",
    title: "BEAT-MEV: Epochless Approach to Batched Threshold Encryption for MEV Prevention",
    authors: ["Jan Bormet", "Sebastian Faust", "Hussien Othman", "Ziyan Qu"],
    year: 2024,
    venue: "USENIX Security 2025",
    links: {
      eprint: "https://eprint.iacr.org/2024/1533",
      pdf: "https://eprint.iacr.org/2024/1533.pdf",
    },
    tags: ["mempool-privacy", "epochless"],
    summary:
      "Removes the expensive per-epoch setup of earlier BTE and studies how users coordinate their transactions.",
    scheme: {
      epochless: true,
    },
  },
  {
    id: "afp24",
    title: "Efficiently-Thresholdizable Batched Identity Based Encryption, with Applications",
    authors: ["Amit Agarwal", "Rex Fernando", "Benny Pinkas"],
    year: 2024,
    venue: "CRYPTO 2025",
    links: {
      eprint: "https://eprint.iacr.org/2024/1575",
      pdf: "https://eprint.iacr.org/2024/1575.pdf",
    },
    tags: ["batched-ibe", "pairings"],
    summary:
      "Defines batched IBE and its threshold version, where authorities issue one succinct key for a batch at a cost independent of the batch size; instantiated from KZG commitments.",
  },
  {
    id: "bcf25",
    title: "BEAST-MEV: Batched Threshold Encryption with Silent Setup for MEV prevention",
    authors: [
      "Jan Bormet",
      "Arka Rai Choudhuri",
      "Sebastian Faust",
      "Sanjam Garg",
      "Hussien Othman",
      "Guru-Vamsi Policharla",
      "Ziyan Qu",
      "Mingyuan Wang",
    ],
    year: 2025,
    venue: "ACM CCS 2026",
    links: {
      eprint: "https://eprint.iacr.org/2025/1419",
      pdf: "https://eprint.iacr.org/2025/1419.pdf",
      doi: "https://doi.org/10.1145/3830454.3846729",
    },
    tags: ["mempool-privacy", "silent-setup", "pairings", "implementation"],
    summary:
      "The first batched threshold encryption scheme with silent setup, built from bilinear pairings and proven secure in the generic group model.",
    scheme: {
      setup: "silent",
      assumptions: ["Generic Group Model"],
    },
  },
  {
    id: "abd25",
    title: "Weighted Batched Threshold Encryption with Applications to Mempool Privacy",
    authors: [
      "Amit Agarwal",
      "Kushal Babel",
      "Sourav Das",
      "Babak Poorebrahim Gilkalaye",
      "Arup Mondal",
      "Benny Pinkas",
      "Peter Rindal",
      "Aayush Yadav",
    ],
    year: 2025,
    links: {
      eprint: "https://eprint.iacr.org/2025/2115",
      pdf: "https://eprint.iacr.org/2025/2115.pdf",
    },
    tags: ["mempool-privacy", "weighted"],
    summary:
      "Improves BEAT-MEV from quadratic to quasilinear computation in the batch size and extends it to weighted committees with communication independent of the weights.",
  },
  {
    id: "bnrt26",
    title: "Efficient Batch Threshold Encryption Using Partial Fraction Techniques",
    authors: ["Dan Boneh", "Rohit Nema", "Arnab Roy", "Ertem Nusret Tas"],
    year: 2026,
    venue: "CRYPTO 2026",
    links: {
      eprint: "https://eprint.iacr.org/2026/674",
      pdf: "https://eprint.iacr.org/2026/674.pdf",
      doi: "https://doi.org/10.1007/978-3-032-35374-0_2",
    },
    tags: ["epochless", "pairings"],
    summary:
      "An epochless, censorship-resistant batch encryption scheme with linear-size public parameters and constant-size pre-decryption keys and ciphertexts, which can be thresholdized.",
    scheme: {
      epochless: true,
      ciphertextSize: "O(1)",
      publicParameterSize: "O(B)",
    },
  },
  {
    id: "adg26",
    title: "BTX: Simple and Efficient Batch Threshold Encryption",
    authors: [
      "Amit Agarwal",
      "Sourav Das",
      "Babak Poorebrahim Gilkalaye",
      "Peter Rindal",
      "Victor Shoup",
    ],
    year: 2026,
    links: {
      eprint: "https://eprint.iacr.org/2026/754",
      pdf: "https://eprint.iacr.org/2026/754.pdf",
    },
    tags: ["epochless", "pairings", "implementation"],
    summary:
      "An epochless, collision-free BTE whose ciphertexts are the size of an ElGamal ciphertext, with FFT-friendly batch decryption.",
    scheme: {
      epochless: true,
      ciphertextSize: "Same as an ElGamal ciphertext",
      decryptionCost: "O(B log B) exponentiations + O(B) pairings",
    },
  },
  {
    id: "pol26a",
    title: "A Simple Batched Threshold Encryption Scheme",
    authors: ["Guru-Vamsi Policharla"],
    year: 2026,
    links: {
      eprint: "https://eprint.iacr.org/2026/760",
      pdf: "https://eprint.iacr.org/2026/760.pdf",
    },
    tags: ["epochless", "pairings", "implementation"],
    summary:
      "A simple, censorship-resistant, epochless BTE with O(B log B) decryption and the shortest known ciphertexts, at the cost of an interactive setup.",
    scheme: {
      setup: "mpc",
      epochless: true,
      ciphertextSize: "|G1| + |GT| (CPA); + 2|F| for CCA",
      decryptionCost: "O(B log B)",
      assumptions: ["Decisional Bilinear B-Power Diffie-Hellman"],
    },
  },
  {
    id: "pol26b",
    title: "DKG Is All You Need",
    authors: ["Guru-Vamsi Policharla"],
    year: 2026,
    links: {
      eprint: "https://eprint.iacr.org/2026/2205",
      pdf: "https://eprint.iacr.org/2026/2205.pdf",
    },
    tags: ["transparent-setup", "dkg", "pairings"],
    summary:
      "The first BTE with a transparent setup whose public parameters are independent of the batch size; the setup is just a DKG.",
    scheme: {
      setup: "dkg",
      ciphertextSize: "2 G1 + 1 G2 + message (+ 2 F for CCA)",
      partialDecryptionSize: "1 G1 element",
      decryptionCost: "O(B) pairings + O(B log² B) group operations",
      assumptions: ["Decisional Bilinear Square Diffie-Hellman"],
    },
  },
];

function eprintOrder(p: Paper): number {
  const m = p.links.eprint?.match(/(\d{4})\/(\d+)/);
  return m ? Number(m[1]) * 1e5 + Number(m[2]) : 0;
}

/** Papers newest first: by year, then by ePrint number, then by title. */
export function sortedPapers(list: readonly Paper[] = papers): Paper[] {
  return [...list].sort(
    (a, b) =>
      b.year - a.year || eprintOrder(b) - eprintOrder(a) || a.title.localeCompare(b.title),
  );
}
