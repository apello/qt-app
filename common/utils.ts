import { Key } from "react";

export interface Chapter {
    number: number;
    name: string;
    verseCount: number;
}

export interface ChapterLog {
  map(arg0: (chapter: ChapterLog) => (string | ChapterLog)[]): Iterable<readonly [unknown, unknown]> | null | undefined;
  number: number;
  name: string;
  lastVerseCompleted: number;
  lastReviewed: Date;
}

export interface ProgressLog {
  data: any;
  id: Key | null | undefined;
  number: number;
  chapterNumber: string;
  verseAmount: number;
  startVerse: number;
  endVerse: number;
  readingType: 'Memorization' | 'Revision';
  createdAt: any;
  archived: boolean;
}

export interface PartLog {
  data: any;
  id: Key | null | undefined;
  number: string;
  verseAmount: number;
  createdAt: any;
}

// Add more restrictions
export const credentialsValid = (credentials: any): boolean => {
  return credentials.email !== "" && credentials.password !== "";
}

export const registrationCredentialsValid = (credentials: any): boolean => {
  return (
    credentials.displayName.length > 0
    && (/[^a-zA-Z]/).test(credentials.displayName)
  );
}

export const prettyPrintDate = (date: any): string => {
    const dateCopy = new Date(date.seconds * 1000 + date.nanoseconds/1000000);
    return dateCopy.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

export const prettyPrintNormalDate = (date: any): string => {
  const dateCopy = new Date(date);
  return dateCopy.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

// export const lastDateReviewed = (date: any): string => {
//   const dateCopy = new Date(date.seconds * 1000 + date.nanoseconds/1000000);
//   return `${dateCopy.getUTCMonth() + 1}/${dateCopy.getUTCDate()}/${dateCopy.getUTCFullYear()}`;
// }

export const chapterAmountMemorized = (lastVerseCompleted: number, name: string, chapterNameToChapter: Map<string, Chapter>): string => {
  const verseCount = chapterNameToChapter.get(name)!.verseCount;
  return ((lastVerseCompleted/verseCount)*100).toFixed(0);
}

const quranVerseCount = 6236; // Without Bismillah

export const totalAmountMemorized = (verseSum: number): number => {
  return parseInt(((verseSum/quranVerseCount)*100).toFixed(0));
}

export const get_today = () => new Date();

export const sortLogs = (sortOption: string, logs: Array<ProgressLog>): Array<ProgressLog>  => {
  let sortedLogs: Array<ProgressLog> = [];
  switch(sortOption) {
    case 'alphabetical':
      sortedLogs = logs.sort((a, b) => {
        if(a.data.chapterName.toLowerCase() < b.data.chapterName.toLowerCase()) return -1;
        if(a.data.chapterName.toLowerCase() > b.data.chapterName.toLowerCase()) return 1;
        return 0;
      });
      break;
    case 'verseAmount':
      sortedLogs = logs.sort((a, b) => { return b.data.verseAmount - a.data.verseAmount })
      break;
    case 'memorization':
      sortedLogs = logs.sort((a, b) => {
        if(a.data.readingType.toLowerCase() < b.data.readingType.toLowerCase()) return -1;
        if(a.data.readingType.toLowerCase() > b.data.readingType.toLowerCase()) return 1;
        return 0;
      })
      break;
    case 'revision':
      sortedLogs = logs.sort((a, b) => {
        if(b.data.readingType.toLowerCase() < a.data.readingType.toLowerCase()) return -1;
        if(b.data.readingType.toLowerCase() > a.data.readingType.toLowerCase()) return 1;
        return 0;
      })
      break;
    case 'createdAt':
      sortedLogs = logs.sort((a, b) => { return a.data.createdAt - b.data.createdAt })
      break;
    default: 
      sortedLogs = logs.sort();
      break;
  }

  return sortedLogs
};

// Surah and Juz objects
// Generated using ChatGPT, verified using Quran.com

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
    "name": "Al-Ma'idah",
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
  //
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
  "name": "Al-Masad",
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
];
  
export const parts = [
{
  "juzNumber": 1,
  "surahs": [
    {
      "number": 1,
      "name": "Al-Fatiha",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 7
      }
    },
    {
      "number": 2,
      "name": "Al-Baqarah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 141
      }
    }
  ]
},
{
  "juzNumber": 2,
  "surahs": [
    {
      "number": 2,
      "name": "Al-Baqarah",
      "verseRange": {
        "startVerse": 142,
        "endVerse": 252
      }
    }
  ]
},
{
  "juzNumber": 3,
  "surahs": [
    {
      "number": 2,
      "name": "Al-Baqarah",
      "verseRange": {
        "startVerse": 253,
        "endVerse": 286
      }
    },
    {
      "number": 3,
      "name": "Aal-E-Imran",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 91
      }
    }
  ]
},
{
  "juzNumber": 4,
  "surahs": [
    {
      "number": 3,
      "name": "Aal-E-Imran",
      "verseRange": {
        "startVerse": 92,
        "endVerse": 200
      }
    },
    {
      "number": 4,
      "name": "An-Nisa",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 23
      }
    }
  ]
},
{
  "juzNumber": 5,
  "surahs": [
    {
      "number": 4,
      "name": "An-Nisa",
      "verseRange": {
        "startVerse": 24,
        "endVerse": 147
      }
    }
  ]
},
{
  "juzNumber": 6,
  "surahs": [
    {
      "number": 4,
      "name": "An-Nisa",
      "verseRange": {
        "startVerse": 148,
        "endVerse": 176
      }
    },
    {
      "number": 5,
      "name": "Al-Ma'idah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 82
      }
    },
  ]
},
{
  "juzNumber": 7,
  "surahs": [
    {
      "number": 5,
      "name": "Al-Ma'idah",
      "verseRange": {
        "startVerse": 83,
        "endVerse": 120
      }
    },
    {
      "number": 6,
      "name": "Al-An'am",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 110
      }
    }
  ]
},
{
  "juzNumber": 8,
  "surahs": [
     {
      "number": 6,
      "name": "Al-An'am",
      "verseRange": {
        "startVerse": 111,
        "endVerse": 165
      }
    },
    {
      "number": 7,
      "name": "Al-A'raf",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 87
      }
    }
  ]
},
{
  "juzNumber": 9,
  "surahs": [
    {
      "number": 7,
      "name": "Al-A'raf",
      "verseRange": {
        "startVerse": 88,
        "endVerse": 206
      }
    },
    {
      "number": 8,
      "name": "Al-Anfal",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 40
      }
    }
  ]
},
{
  "juzNumber": 10,
  "surahs": [
    {
      "number": 8,
      "name": "Al-Anfal",
      "verseRange": {
        "startVerse": 41,
        "endVerse": 75
      }
    },
    {
      "number": 9,
      "name": "At-Tawbah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 93
      }
    }
  ]
},
{
  "juzNumber": 11,
  "surahs": [
    {
      "number": 9,
      "name": "At-Tawbah",
      "verseRange": {
        "startVerse": 94,
        "endVerse": 129
      }
    },
    {
      "number": 10,
      "name": "Yunus",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 109
      }
    },
    {
      "number": 11,
      "name": "Hud",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 5
      }
    },
  ]
},
{
  "juzNumber": 12,
  "surahs": [
    {
      "number": 11,
      "name": "Hud",
      "verseRange": {
        "startVerse": 6,
        "endVerse": 123
      }
    },
    {
      "number": 12,
      "name": "Yusuf",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 52
      }
    },
  ]
},
{
  "juzNumber": 13,
  "surahs": [
    {
      "number": 12,
      "name": "Yusuf",
      "verseRange": {
        "startVerse": 53,
        "endVerse": 111
      }
    },
    {
      "number": 13,
      "name": "Ar-Ra'd",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 43
      }
    },
    {
      "number": 14,
      "name": "Ibrahim",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 52
      }
    },
    {
      "number": 15,
      "name": "Al-Hijr",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 1
      }
    }
  ]
},
{
  "juzNumber": 14,
  "surahs": [
    {
      "number": 15,
      "name": "Al-Hijr",
      "verseRange": {
        "startVerse": 2,
        "endVerse": 99
      }
    },
    {
      "number": 16,
      "name": "An-Nahl",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 128
      }
    }
  ]
},
{
  "juzNumber": 15,
  "surahs": [
    {
      "number": 17,
      "name": "Al-Isra",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 111
      }
    },
    {
      "number": 18,
      "name": "Al-Kahf",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 74
      }
    },
  ]
},
{
  "juzNumber": 16,
  "surahs": [
    {
      "number": 18,
      "name": "Al-Kahf",
      "verseRange": {
        "startVerse": 75,
        "endVerse": 110
      }
    },
    {
      "number": 19,
      "name": "Maryam",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 98
      }
    },
    {
      "number": 20,
      "name": "Ta-Ha",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 135
      }
    },
  ]
},
{
  "juzNumber": 17,
  "surahs": [
    {
      "number": 21,
      "name": "Al-Anbiya",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 112
      }
    },
    {
      "number": 22,
      "name": "Al-Hajj",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 78
      }
    }
  ]
},
{
  "juzNumber": 18,
  "surahs": [
    {
      "number": 23,
      "name": "Al-Mu'minun",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 118
      }
    },
    {
      "number": 24,
      "name": "An-Nur",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 64
      }
    },
    {
      "number": 25,
      "name": "Al-Furqan",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 20
      }
    }
  ]
},
{
  "juzNumber": 19,
  "surahs": [
    {
      "number": 25,
      "name": "Al-Furqan",
      "verseRange": {
        "startVerse": 21,
        "endVerse": 77
      }
    },
    {
      "number": 26,
      "name": "Ash-Shu'ara",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 227
      }
    },
    {
      "number": 27,
      "name": "An-Naml",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 59
      }
    }
  ]
},
{
  "juzNumber": 20,
  "surahs": [
    {
      "number": 27,
      "name": "An-Naml",
      "verseRange": {
        "startVerse": 60,
        "endVerse": 93
      }
    },
    {
      "number": 28,
      "name": "Al-Qasas",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 88
      }
    },
    {
      "number": 29,
      "name": "Al-Ankabut",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 44
      }
    }
  ]
},
{
  "juzNumber": 21,
  "surahs": [
    {
      "number": 29,
      "name": "Al-Ankabut",
      "verseRange": {
        "startVerse": 45,
        "endVerse": 69
      }
    },
    {
      "number": 30,
      "name": "Ar-Rum",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 60
      }
    },
    {
      "number": 31,
      "name": "Luqman",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 34
      }
    },
    {
      "number": 32,
      "name": "As-Sajda",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 30
      }
    },
    {
      "number": 33,
      "name": "Al-Ahzab",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 30
      }
    }
  ]
},
{
  "juzNumber": 22,
  "surahs": [
    {
      "number": 33,
      "name": "Al-Ahzab",
      "verseRange": {
        "startVerse": 31,
        "endVerse": 73
      }
    },
    {
      "number": 34,
      "name": "Saba",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 54
      }
    },
    {
      "number": 35,
      "name": "Fatir",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 45
      }
    },
    {
      "number": 36,
      "name": "Ya-Sin",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 21
      }
    }
  ]
},
{
  "juzNumber": 23,
  "surahs": [
    {
      "number": 36,
      "name": "Ya-Sin",
      "verseRange": {
        "startVerse": 22,
        "endVerse": 83
      }
    },
    {
      "number": 37,
      "name": "As-Saffat",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 182
      }
    },
    {
      "number": 38,
      "name": "Sad",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 88
      }
    },
    {
      "number": 39,
      "name": "Az-Zumar",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 31
      }
    }
  ]
},
{
  "juzNumber": 24,
  "surahs": [
    {
      "number": 39,
      "name": "Az-Zumar",
      "verseRange": {
        "startVerse": 32,
        "endVerse": 75
      }
    },
    {
      "number": 40,
      "name": "Ghafir",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 85
      }
    },
    {
      "number": 41,
      "name": "Fussilat",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 46
      }
    },
  ]
},
{
  "juzNumber": 25,
  "surahs": [
    {
      "number": 41,
      "name": "Fussilat",
      "verseRange": {
        "startVerse": 47,
        "endVerse": 54
      }
    },
    {
      "number": 42,
      "name": "Ash-Shura",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 53
      }
    },
    {
      "number": 43,
      "name": "Az-Zukhruf",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 89
      }
    },
    {
      "number": 44,
      "name": "Ad-Dukhan",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 59
      }
    },
    {
      "number": 45,
      "name": "Al-Jathiya",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 37
      }
    },
  ]
},
{
  "juzNumber": 26,
  "surahs": [
    {
      "number": 46,
      "name": "Al-Ahqaf",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 35
      }
    },
    {
      "number": 47,
      "name": "Muhammad",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 38
      }
    },
    {
      "number": 48,
      "name": "Al-Fath",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 29
      }
    },
    {
      "number": 49,
      "name": "Al-Hujurat",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 18
      }
    },
    {
      "number": 50,
      "name": "Qaf",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 45
      }
    },
    {
      "number": 51,
      "name": "Adh-Dhariyat",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 30
      }
    }
  ]
},
{
  "juzNumber": 27,
  "surahs": [
    {
      "number": 51,
      "name": "Adh-Dhariyat",
      "verseRange": {
        "startVerse": 31,
        "endVerse": 60
      }
    },
    {
      "number": 52,
      "name": "At-Tur",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 49
      }
    },
    {
      "number": 53,
      "name": "An-Najm",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 62
      }
    },
    {
      "number": 54,
      "name": "Al-Qamar",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 55
      }
    },
    {
      "number": 55,
      "name": "Ar-Rahman",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 78
      }
    },

    {
      "number": 56,
      "name": "Al-Waqi'ah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 96
      }
    },
    {
      "number": 57,
      "name": "Al-Hadid",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 29
      }
    }
  ]
},
{
  "juzNumber": 28,
  "surahs": [
    {
      "number": 58,
      "name": "Al-Mujadila",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 22
      }
    },
    {
      "number": 59,
      "name": "Al-Hashr",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 24
      }
    },
    {
      "number": 60,
      "name": "Al-Mumtahanah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 13
      }
    },
    {
      "number": 61,
      "name": "As-Saff",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 14
      }
    },
    {
      "number": 62,
      "name": "Al-Jumu'ah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 11
      }
    },
    {
      "number": 63,
      "name": "Al-Munafiqun",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 11
      }
    },
    {
      "number": 64,
      "name": "At-Taghabun",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 18
      }
    },
    {
      "number": 65,
      "name": "At-Talaq",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 12
      }
    },
    {
      "number": 66,
      "name": "At-Tahrim",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 12
      }
    }     
  ]
},
{
  "juzNumber": 29,
  "surahs": [
    {
      "number": 67,
      "name": "Al-Mulk",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 30
      }
    },
    {
      "number": 68,
      "name": "Al-Qalam",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 52
      }
    },
    {
      "number": 69,
      "name": "Al-Haqqah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 52
      }
    },
    {
      "number": 70,
      "name": "Al-Ma'arij",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 44
      }
    },
    {
      "number": 71,
      "name": "Nuh",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 28
      }
    },
    {
      "number": 72,
      "name": "Al-Jinn",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 28
      }
    },
    {
      "number": 73,
      "name": "Al-Muzzammil",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 20
      }
    },
    {
      "number": 74,
      "name": "Al-Muddathir",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 56
      }
    },
    {
      "number": 75,
      "name": "Al-Qiyamah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 40
      }
    },
    {
      "number": 76,
      "name": "Al-Insan",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 31
      }
    },
    {
      "number": 77,
      "name": "Al-Mursalat",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 50
      }
    }
  ]
},
{
  "juzNumber": 30,
  "surahs": [
    {
      "number": 78,
      "name": "An-Naba",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 40
      }
    },
    {
      "number": 79,
      "name": "An-Nazi'at",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 46
      }
    },
    {
      "number": 80,
      "name": "Abasa",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 42
      }
    },
    {
      "number": 81,
      "name": "At-Takwir",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 29
      }
    },
    {
      "number": 82,
      "name": "Al-Infitar",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 19
      }
    },
    {
      "number": 83,
      "name": "Al-Mutaffifin",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 36
      }
    },
    {
      "number": 84,
      "name": "Al-Inshiqaq",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 25
      }
    },
    {
      "number": 85,
      "name": "Al-Buruj",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 22
      }
    },
    {
      "number": 86,
      "name": "At-Tariq",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 17
      }
    },
    {
      "number": 87,
      "name": "Al-Ala",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 19
      }
    },
    {
      "number": 88,
      "name": "Al-Ghashiyah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 26
      }
    },
    {
      "number": 89,
      "name": "Al-Fajr",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 30
      }
    },
    {
      "number": 90,
      "name": "Al-Balad",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 20
      }
    },
    {
      "number": 91,
      "name": "Ash-Shams",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 15
      }
    },
    {
      "number": 92,
      "name": "Al-Lail",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 21
      }
    },
    {
      "number": 93,
      "name": "Ad-Duha",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 11
      }
    },
    {
      "number": 94,
      "name": "Ash-Sharh",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 8
      }
    },
    {
      "number": 95,
      "name": "At-Tin",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 8
      }
    },
    {
      "number": 96,
      "name": "Al-Alaq",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 19
      }
    },
    {
      "number": 97,
      "name": "Al-Qadr",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 5
      }
    },
    {
      "number": 98,
      "name": "Al-Bayyinah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 8
      }
    },
    {
      "number": 99,
      "name": "Az-Zalzalah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 8
      }
    },
    {
      "number": 100,
      "name": "Al-'Adiyat",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 11
      }
    },
    {
      "number": 101,
      "name": "Al-Qari'ah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 11
      }
    },
    {
      "number": 102,
      "name": "At-Takathur",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 8
      }
    },
    {
      "number": 103,
      "name": "Al-Asr",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 3
      }
    },
    {
      "number": 104,
      "name": "Al-Humazah",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 9
      }
    },
    {
      "number": 105,
      "name": "Al-Fil",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 5
      }
    },
    {
      "number": 106,
      "name": "Quraysh",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 4
      }
    },
    {
      "number": 107,
      "name": "Al-Ma'un",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 7
      }
    },
    {
      "number": 108,
      "name": "Al-Kawthar",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 3
      }
    },
    {
      "number": 109,
      "name": "Al-Kafirun",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 6
      }
    },
    {
      "number": 110,
      "name": "An-Nasr",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 3
      }
    },
    {
      "number": 111,
      "name": "Al-Masad",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 5
      }
    },
    {
      "number": 112,
      "name": "Al-Ikhlas",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 4
      }
    },
    {
      "number": 113,
      "name": "Al-Falaq",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 5
      }
    },
    {
      "number": 114,
      "name": "An-Nas",
      "verseRange": {
        "startVerse": 1,
        "endVerse": 6
      }
    }
  ]
}
];

export const chapterNameToChapter = new Map(chapters.map(chapter => [chapter.name, chapter]));
export const partNumberToPart = new Map(parts.map(part => [part.juzNumber, part]));
