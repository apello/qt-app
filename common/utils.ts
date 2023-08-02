
// All under userId

export interface ChapterLog {
    id: number; // number
    name: string;
    percentComplete: number;
    lastReviewed: Date;
}

export interface Chapter {
    number: number;
    name: string;
    verseCount: number;
}

export interface ProgressLog {
    id: number;
    number: number;
    chapterName: string;
    verseAmount: number;
    startVerse: number;
    endVerse: number;
    readingType: 'Memorization' | 'Revision';
    createdAt: any;
    archived: boolean;
}

export const prettyPrintDate = (date: Date): string => {
    const dateCopy = new Date(date);
    return `${dateCopy.getUTCMonth() + 1}/${dateCopy.getUTCDate()}/${dateCopy.getUTCFullYear()}`;
};

// Chapter object

export const chapters = [
    {
      "number": 1,
      "name": "Al-Fatiha",
      "verseCount": 7
    },
    {
      "number": 2,
      "name": "Al-Baqarah",
      "verseCount": 286
    },
    {
      "number": 3,
      "name": "Aal-E-Imran",
      "verseCount": 200
    },
    {
      "number": 4,
      "name": "An-Nisa",
      "verseCount": 176
    },
    {
      "number": 5,
      "name": "Al-Maidah",
      "verseCount": 120
    },
    {
      "number": 6,
      "name": "Al-An'am",
      "verseCount": 165
    },
    {
      "number": 7,
      "name": "Al-A'raf",
      "verseCount": 206
    },
    {
      "number": 8,
      "name": "Al-Anfal",
      "verseCount": 75
    },
    {
      "number": 9,
      "name": "At-Tawbah",
      "verseCount": 129
    },
    {
      "number": 10,
      "name": "Yunus",
      "verseCount": 109
    },
    {
      "number": 11,
      "name": "Hud",
      "verseCount": 123
    },
    {
      "number": 12,
      "name": "Yusuf",
      "verseCount": 111
    },
    {
      "number": 13,
      "name": "Ar-Ra'd",
      "verseCount": 43
    },
    {
      "number": 14,
      "name": "Ibrahim",
      "verseCount": 52
    },
    {
      "number": 15,
      "name": "Al-Hijr",
      "verseCount": 99
    },
    {
      "number": 16,
      "name": "An-Nahl",
      "verseCount": 128
    },
    {
      "number": 17,
      "name": "Al-Isra",
      "verseCount": 111
    },
    {
      "number": 18,
      "name": "Al-Kahf",
      "verseCount": 110
    },
    {
      "number": 19,
      "name": "Maryam",
      "verseCount": 98
    },
    {
      "number": 20,
      "name": "Ta-Ha",
      "verseCount": 135
    },
    {
      "number": 21,
      "name": "Al-Anbiya",
      "verseCount": 112
    },
    {
      "number": 22,
      "name": "Al-Hajj",
      "verseCount": 78
    },
    {
      "number": 23,
      "name": "Al-Muminun",
      "verseCount": 118
    },
    {
      "number": 24,
      "name": "An-Nur",
      "verseCount": 64
    },
    {
      "number": 25,
      "name": "Al-Furqan",
      "verseCount": 77
    },
    {
      "number": 26,
      "name": "Ash-Shu'ara",
      "verseCount": 227
    },
    {
      "number": 27,
      "name": "An-Naml",
      "verseCount": 93
    },
    {
      "number": 28,
      "name": "Al-Qasas",
      "verseCount": 88
    },
    {
      "number": 29,
      "name": "Al-Ankabut",
      "verseCount": 69
    },
    {
      "number": 30,
      "name": "Ar-Rum",
      "verseCount": 60
    },
    {
      "number": 31,
      "name": "Luqman",
      "verseCount": 34
    },
    {
      "number": 32,
      "name": "As-Sajda",
      "verseCount": 30
    },
    {
      "number": 33,
      "name": "Al-Ahzab",
      "verseCount": 73
    },
    {
      "number": 34,
      "name": "Saba",
      "verseCount": 54
    },
    {
      "number": 35,
      "name": "Fatir",
      "verseCount": 45
    },
    {
      "number": 36,
      "name": "Ya-Sin",
      "verseCount": 83
    },
    {
      "number": 37,
      "name": "As-Saffat",
      "verseCount": 182
    },
    {
      "number": 38,
      "name": "Sad",
      "verseCount": 88
    },
    {
      "number": 39,
      "name": "Az-Zumar",
      "verseCount": 75
    },
    {
      "number": 40,
      "name": "Ghafir",
      "verseCount": 85
    },
    {
      "number": 41,
      "name": "Fussilat",
      "verseCount": 54
    },
    {
      "number": 42,
      "name": "Ash-Shura",
      "verseCount": 53
    },
    {
      "number": 43,
      "name": "Az-Zukhruf",
      "verseCount": 89
    },
    {
      "number": 44,
      "name": "Ad-Dukhan",
      "verseCount": 59
    },
    {
      "number": 45,
      "name": "Al-Jathiya",
      "verseCount": 37
    },
    {
      "number": 46,
      "name": "Al-Ahqaf",
      "verseCount": 35
    },
    {
      "number": 47,
      "name": "Muhammad",
      "verseCount": 38
    },
    {
      "number": 48,
      "name": "Al-Fath",
      "verseCount": 29
    },
    {
      "number": 49,
      "name": "Al-Hujurat",
      "verseCount": 18
    },
    {
      "number": 50,
      "name": "Qaf",
      "verseCount": 45
    },
    {
      "number": 51,
      "name": "Adh-Dhariyat",
      "verseCount": 60
    },
    {
        "number": 52,
        "name": "At-Tur",
        "verseCount": 49
    },
    {
    "number": 53,
    "name": "An-Najm",
    "verseCount": 62
    },
    {
    "number": 54,
    "name": "Al-Qamar",
    "verseCount": 55
    },
    {
    "number": 55,
    "name": "Ar-Rahman",
    "verseCount": 78
    },
    {
    "number": 56,
    "name": "Al-Waqi'ah",
    "verseCount": 96
    },
    {
    "number": 57,
    "name": "Al-Hadid",
    "verseCount": 29
    },
    {
    "number": 58,
    "name": "Al-Mujadila",
    "verseCount": 22
    },
    {
    "number": 59,
    "name": "Al-Hashr",
    "verseCount": 24
    },
    {
    "number": 60,
    "name": "Al-Mumtahanah",
    "verseCount": 13
    },
    {
    "number": 61,
    "name": "As-Saff",
    "verseCount": 14
    },
    {
    "number": 62,
    "name": "Al-Jumu'ah",
    "verseCount": 11
    },
    {
    "number": 63,
    "name": "Al-Munafiqun",
    "verseCount": 11
    },
    {
    "number": 64,
    "name": "At-Taghabun",
    "verseCount": 18
    },
    {
    "number": 65,
    "name": "At-Talaq",
    "verseCount": 12
    },
    {
    "number": 66,
    "name": "At-Tahrim",
    "verseCount": 12
    },
    {
    "number": 67,
    "name": "Al-Mulk",
    "verseCount": 30
    },
    {
    "number": 68,
    "name": "Al-Qalam",
    "verseCount": 52
    },
    {
    "number": 69,
    "name": "Al-Haqqah",
    "verseCount": 52
    },
    {
    "number": 70,
    "name": "Al-Ma'arij",
    "verseCount": 44
    },
    {
    "number": 71,
    "name": "Nuh",
    "verseCount": 28
    },
    {
    "number": 72,
    "name": "Al-Jinn",
    "verseCount": 28
    },
    {
    "number": 73,
    "name": "Al-Muzzammil",
    "verseCount": 20
    },
    {
    "number": 74,
    "name": "Al-Muddathir",
    "verseCount": 56
    },
    {
    "number": 75,
    "name": "Al-Qiyamah",
    "verseCount": 40
    },
    {
    "number": 76,
    "name": "Al-Insan",
    "verseCount": 31
    },
    {
    "number": 77,
    "name": "Al-Mursalat",
    "verseCount": 50
    },
    {
    "number": 78,
    "name": "An-Naba",
    "verseCount": 40
    },
    {
    "number": 79,
    "name": "An-Nazi'at",
    "verseCount": 46
    },
    {
    "number": 80,
    "name": "Abasa",
    "verseCount": 42
    },
    {
    "number": 81,
    "name": "At-Takwir",
    "verseCount": 29
    },
    {
    "number": 82,
    "name": "Al-Infitar",
    "verseCount": 19
    },
    {
    "number": 83,
    "name": "Al-Mutaffifin",
    "verseCount": 36
    },
    {
    "number": 84,
    "name": "Al-Inshiqaq",
    "verseCount": 25
    },
    {
    "number": 85,
    "name": "Al-Buruj",
    "verseCount": 22
    },
    {
    "number": 86,
    "name": "At-Tariq",
    "verseCount": 17
    },
    {
    "number": 87,
    "name": "Al-Ala",
    "verseCount": 19
    },
    {
    "number": 88,
    "name": "Al-Ghashiyah",
    "verseCount": 26
    },
    {
    "number": 89,
    "name": "Al-Fajr",
    "verseCount": 30
    },
    {
    "number": 90,
    "name": "Al-Balad",
    "verseCount": 20
    },
    {
    "number": 91,
    "name": "Ash-Shams",
    "verseCount": 15
    },
    {
    "number": 92,
    "name": "Al-Lail",
    "verseCount": 21
    },
    {
    "number": 93,
    "name": "Ad-Duha",
    "verseCount": 11
    },
    {
    "number": 94,
    "name": "Ash-Sharh",
    "verseCount": 8
    },
    {
    "number": 95,
    "name": "At-Tin",
    "verseCount": 8
    },
    {
    "number": 96,
    "name": "Al-Alaq",
    "verseCount": 19
    },
    {
    "number": 97,
    "name": "Al-Qadr",
    "verseCount": 5
    },
    {
    "number": 98,
    "name": "Al-Bayyinah",
    "verseCount": 8
    },
    {
    "number": 99,
    "name": "Az-Zalzalah",
    "verseCount": 8
    },
    {
    "number": 100,
    "name": "Al-'Adiyat",
    "verseCount": 11
    },
    {
    "number": 101,
    "name": "Al-Qari'ah",
    "verseCount": 11
    },
    {
    "number": 102,
    "name": "At-Takathur",
    "verseCount": 8
    },
    {
    "number": 103,
    "name": "Al-Asr",
    "verseCount": 3
    },
    {
    "number": 104,
    "name": "Al-Humazah",
    "verseCount": 9
    },
    {
    "number": 105,
    "name": "Al-Fil",
    "verseCount": 5
    },
    {
    "number": 106,
    "name": "Quraysh",
    "verseCount": 4
    },
    {
    "number": 107,
    "name": "Al-Ma'un",
    "verseCount": 7
    },
    {
    "number": 108,
    "name": "Al-Kawthar",
    "verseCount": 3
    },
    {
    "number": 109,
    "name": "Al-Kafirun",
    "verseCount": 6
    },
    {
    "number": 110,
    "name": "An-Nasr",
    "verseCount": 3
    },
    {
    "number": 111,
    "name": "Al-Lahab",
    "verseCount": 5
    },
    {
    "number": 112,
    "name": "Al-Ikhlas",
    "verseCount": 4
    },
    {
    "number": 113,
    "name": "Al-Falaq",
    "verseCount": 5
    },
    {
    "number": 114,
    "name": "An-Nas",
    "verseCount": 6
    }
]
    