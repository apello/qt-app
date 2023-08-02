
// All under userId

export interface Chapter {
    id: number; // chapterNumber
    name: string;
    percentComplete: number;
    lastReviewed: Date;
}

export interface Log {
    id: number;
    chapterNumber: number;
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
      "chapterNumber": 1,
      "name": "Al-Fatiha",
      "verseCount": 7
    },
    {
      "chapterNumber": 2,
      "name": "Al-Baqarah",
      "verseCount": 286
    },
    {
      "chapterNumber": 3,
      "name": "Aal-E-Imran",
      "verseCount": 200
    },
    {
      "chapterNumber": 4,
      "name": "An-Nisa",
      "verseCount": 176
    },
    {
      "chapterNumber": 5,
      "name": "Al-Maidah",
      "verseCount": 120
    },
    {
      "chapterNumber": 6,
      "name": "Al-An'am",
      "verseCount": 165
    },
    {
      "chapterNumber": 7,
      "name": "Al-A'raf",
      "verseCount": 206
    },
    {
      "chapterNumber": 8,
      "name": "Al-Anfal",
      "verseCount": 75
    },
    {
      "chapterNumber": 9,
      "name": "At-Tawbah",
      "verseCount": 129
    },
    {
      "chapterNumber": 10,
      "name": "Yunus",
      "verseCount": 109
    },
    {
      "chapterNumber": 11,
      "name": "Hud",
      "verseCount": 123
    },
    {
      "chapterNumber": 12,
      "name": "Yusuf",
      "verseCount": 111
    },
    {
      "chapterNumber": 13,
      "name": "Ar-Ra'd",
      "verseCount": 43
    },
    {
      "chapterNumber": 14,
      "name": "Ibrahim",
      "verseCount": 52
    },
    {
      "chapterNumber": 15,
      "name": "Al-Hijr",
      "verseCount": 99
    },
    {
      "chapterNumber": 16,
      "name": "An-Nahl",
      "verseCount": 128
    },
    {
      "chapterNumber": 17,
      "name": "Al-Isra",
      "verseCount": 111
    },
    {
      "chapterNumber": 18,
      "name": "Al-Kahf",
      "verseCount": 110
    },
    {
      "chapterNumber": 19,
      "name": "Maryam",
      "verseCount": 98
    },
    {
      "chapterNumber": 20,
      "name": "Ta-Ha",
      "verseCount": 135
    },
    {
      "chapterNumber": 21,
      "name": "Al-Anbiya",
      "verseCount": 112
    },
    {
      "chapterNumber": 22,
      "name": "Al-Hajj",
      "verseCount": 78
    },
    {
      "chapterNumber": 23,
      "name": "Al-Muminun",
      "verseCount": 118
    },
    {
      "chapterNumber": 24,
      "name": "An-Nur",
      "verseCount": 64
    },
    {
      "chapterNumber": 25,
      "name": "Al-Furqan",
      "verseCount": 77
    },
    {
      "chapterNumber": 26,
      "name": "Ash-Shu'ara",
      "verseCount": 227
    },
    {
      "chapterNumber": 27,
      "name": "An-Naml",
      "verseCount": 93
    },
    {
      "chapterNumber": 28,
      "name": "Al-Qasas",
      "verseCount": 88
    },
    {
      "chapterNumber": 29,
      "name": "Al-Ankabut",
      "verseCount": 69
    },
    {
      "chapterNumber": 30,
      "name": "Ar-Rum",
      "verseCount": 60
    },
    {
      "chapterNumber": 31,
      "name": "Luqman",
      "verseCount": 34
    },
    {
      "chapterNumber": 32,
      "name": "As-Sajda",
      "verseCount": 30
    },
    {
      "chapterNumber": 33,
      "name": "Al-Ahzab",
      "verseCount": 73
    },
    {
      "chapterNumber": 34,
      "name": "Saba",
      "verseCount": 54
    },
    {
      "chapterNumber": 35,
      "name": "Fatir",
      "verseCount": 45
    },
    {
      "chapterNumber": 36,
      "name": "Ya-Sin",
      "verseCount": 83
    },
    {
      "chapterNumber": 37,
      "name": "As-Saffat",
      "verseCount": 182
    },
    {
      "chapterNumber": 38,
      "name": "Sad",
      "verseCount": 88
    },
    {
      "chapterNumber": 39,
      "name": "Az-Zumar",
      "verseCount": 75
    },
    {
      "chapterNumber": 40,
      "name": "Ghafir",
      "verseCount": 85
    },
    {
      "chapterNumber": 41,
      "name": "Fussilat",
      "verseCount": 54
    },
    {
      "chapterNumber": 42,
      "name": "Ash-Shura",
      "verseCount": 53
    },
    {
      "chapterNumber": 43,
      "name": "Az-Zukhruf",
      "verseCount": 89
    },
    {
      "chapterNumber": 44,
      "name": "Ad-Dukhan",
      "verseCount": 59
    },
    {
      "chapterNumber": 45,
      "name": "Al-Jathiya",
      "verseCount": 37
    },
    {
      "chapterNumber": 46,
      "name": "Al-Ahqaf",
      "verseCount": 35
    },
    {
      "chapterNumber": 47,
      "name": "Muhammad",
      "verseCount": 38
    },
    {
      "chapterNumber": 48,
      "name": "Al-Fath",
      "verseCount": 29
    },
    {
      "chapterNumber": 49,
      "name": "Al-Hujurat",
      "verseCount": 18
    },
    {
      "chapterNumber": 50,
      "name": "Qaf",
      "verseCount": 45
    },
    {
      "chapterNumber": 51,
      "name": "Adh-Dhariyat",
      "verseCount": 60
    },
    {
        "chapterNumber": 52,
        "name": "At-Tur",
        "verseCount": 49
    },
    {
    "chapterNumber": 53,
    "name": "An-Najm",
    "verseCount": 62
    },
    {
    "chapterNumber": 54,
    "name": "Al-Qamar",
    "verseCount": 55
    },
    {
    "chapterNumber": 55,
    "name": "Ar-Rahman",
    "verseCount": 78
    },
    {
    "chapterNumber": 56,
    "name": "Al-Waqi'ah",
    "verseCount": 96
    },
    {
    "chapterNumber": 57,
    "name": "Al-Hadid",
    "verseCount": 29
    },
    {
    "chapterNumber": 58,
    "name": "Al-Mujadila",
    "verseCount": 22
    },
    {
    "chapterNumber": 59,
    "name": "Al-Hashr",
    "verseCount": 24
    },
    {
    "chapterNumber": 60,
    "name": "Al-Mumtahanah",
    "verseCount": 13
    },
    {
    "chapterNumber": 61,
    "name": "As-Saff",
    "verseCount": 14
    },
    {
    "chapterNumber": 62,
    "name": "Al-Jumu'ah",
    "verseCount": 11
    },
    {
    "chapterNumber": 63,
    "name": "Al-Munafiqun",
    "verseCount": 11
    },
    {
    "chapterNumber": 64,
    "name": "At-Taghabun",
    "verseCount": 18
    },
    {
    "chapterNumber": 65,
    "name": "At-Talaq",
    "verseCount": 12
    },
    {
    "chapterNumber": 66,
    "name": "At-Tahrim",
    "verseCount": 12
    },
    {
    "chapterNumber": 67,
    "name": "Al-Mulk",
    "verseCount": 30
    },
    {
    "chapterNumber": 68,
    "name": "Al-Qalam",
    "verseCount": 52
    },
    {
    "chapterNumber": 69,
    "name": "Al-Haqqah",
    "verseCount": 52
    },
    {
    "chapterNumber": 70,
    "name": "Al-Ma'arij",
    "verseCount": 44
    },
    {
    "chapterNumber": 71,
    "name": "Nuh",
    "verseCount": 28
    },
    {
    "chapterNumber": 72,
    "name": "Al-Jinn",
    "verseCount": 28
    },
    {
    "chapterNumber": 73,
    "name": "Al-Muzzammil",
    "verseCount": 20
    },
    {
    "chapterNumber": 74,
    "name": "Al-Muddathir",
    "verseCount": 56
    },
    {
    "chapterNumber": 75,
    "name": "Al-Qiyamah",
    "verseCount": 40
    },
    {
    "chapterNumber": 76,
    "name": "Al-Insan",
    "verseCount": 31
    },
    {
    "chapterNumber": 77,
    "name": "Al-Mursalat",
    "verseCount": 50
    },
    {
    "chapterNumber": 78,
    "name": "An-Naba",
    "verseCount": 40
    },
    {
    "chapterNumber": 79,
    "name": "An-Nazi'at",
    "verseCount": 46
    },
    {
    "chapterNumber": 80,
    "name": "Abasa",
    "verseCount": 42
    },
    {
    "chapterNumber": 81,
    "name": "At-Takwir",
    "verseCount": 29
    },
    {
    "chapterNumber": 82,
    "name": "Al-Infitar",
    "verseCount": 19
    },
    {
    "chapterNumber": 83,
    "name": "Al-Mutaffifin",
    "verseCount": 36
    },
    {
    "chapterNumber": 84,
    "name": "Al-Inshiqaq",
    "verseCount": 25
    },
    {
    "chapterNumber": 85,
    "name": "Al-Buruj",
    "verseCount": 22
    },
    {
    "chapterNumber": 86,
    "name": "At-Tariq",
    "verseCount": 17
    },
    {
    "chapterNumber": 87,
    "name": "Al-Ala",
    "verseCount": 19
    },
    {
    "chapterNumber": 88,
    "name": "Al-Ghashiyah",
    "verseCount": 26
    },
    {
    "chapterNumber": 89,
    "name": "Al-Fajr",
    "verseCount": 30
    },
    {
    "chapterNumber": 90,
    "name": "Al-Balad",
    "verseCount": 20
    },
    {
    "chapterNumber": 91,
    "name": "Ash-Shams",
    "verseCount": 15
    },
    {
    "chapterNumber": 92,
    "name": "Al-Lail",
    "verseCount": 21
    },
    {
    "chapterNumber": 93,
    "name": "Ad-Duha",
    "verseCount": 11
    },
    {
    "chapterNumber": 94,
    "name": "Ash-Sharh",
    "verseCount": 8
    },
    {
    "chapterNumber": 95,
    "name": "At-Tin",
    "verseCount": 8
    },
    {
    "chapterNumber": 96,
    "name": "Al-Alaq",
    "verseCount": 19
    },
    {
    "chapterNumber": 97,
    "name": "Al-Qadr",
    "verseCount": 5
    },
    {
    "chapterNumber": 98,
    "name": "Al-Bayyinah",
    "verseCount": 8
    },
    {
    "chapterNumber": 99,
    "name": "Az-Zalzalah",
    "verseCount": 8
    },
    {
    "chapterNumber": 100,
    "name": "Al-'Adiyat",
    "verseCount": 11
    },
    {
    "chapterNumber": 101,
    "name": "Al-Qari'ah",
    "verseCount": 11
    },
    {
    "chapterNumber": 102,
    "name": "At-Takathur",
    "verseCount": 8
    },
    {
    "chapterNumber": 103,
    "name": "Al-Asr",
    "verseCount": 3
    },
    {
    "chapterNumber": 104,
    "name": "Al-Humazah",
    "verseCount": 9
    },
    {
    "chapterNumber": 105,
    "name": "Al-Fil",
    "verseCount": 5
    },
    {
    "chapterNumber": 106,
    "name": "Quraysh",
    "verseCount": 4
    },
    {
    "chapterNumber": 107,
    "name": "Al-Ma'un",
    "verseCount": 7
    },
    {
    "chapterNumber": 108,
    "name": "Al-Kawthar",
    "verseCount": 3
    },
    {
    "chapterNumber": 109,
    "name": "Al-Kafirun",
    "verseCount": 6
    },
    {
    "chapterNumber": 110,
    "name": "An-Nasr",
    "verseCount": 3
    },
    {
    "chapterNumber": 111,
    "name": "Al-Lahab",
    "verseCount": 5
    },
    {
    "chapterNumber": 112,
    "name": "Al-Ikhlas",
    "verseCount": 4
    },
    {
    "chapterNumber": 113,
    "name": "Al-Falaq",
    "verseCount": 5
    },
    {
    "chapterNumber": 114,
    "name": "An-Nas",
    "verseCount": 6
    }
]
    