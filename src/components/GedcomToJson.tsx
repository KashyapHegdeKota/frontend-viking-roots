// gedcomParser.ts

// Type-only exports
export type FamilyMember = {
  id: string;
  data: {
    "first name": string;
    "last name": string;
    "birthday": string;
    "gender": "M" | "F";
    "death"?: string;
    "occupation"?: string;
    "birthPlace"?: string;
    "deathPlace"?: string;
    "residence"?: string[];
  };
  rels: {
    spouses?: string[];
    children?: string[];
    parents?: string[];
  };
};

export type GedcomIndividual = {
  id: string;
  name?: {
    given?: string;
    surname?: string;
    suffix?: string;
  };
  sex?: 'M' | 'F';
  birth?: {
    date?: string;
    place?: string;
  };
  death?: {
    date?: string;
    place?: string;
  };
  occupation?: string;
  residence?: Array<{
    date?: string;
    place?: string;
  }>;
  families?: {
    spouse?: string[];
    children?: string[];
  };
  sources?: string[];
};

export type GedcomFamily = {
  id: string;
  husband?: string;
  wife?: string;
  children?: string[];
  marriage?: {
    date?: string;
    place?: string;
  };
  divorce?: {
    date?: string;
    place?: string;
  };
};

export type MarriageEvent = {
  year: number;
  husbandName: string;
  wifeName: string;
  place?: string;
};

// Value exports (classes and functions)
export class AncestryGedcomParser {
  individuals: Map<string, GedcomIndividual> = new Map();
  families: Map<string, GedcomFamily> = new Map();
  private currentRecord: 'INDI' | 'FAM' | 'SOUR' | 'OBJE' | 'SUBM' | null = null;
  private currentId: string = '';
  private currentTag: string = '';
  private tagStack: Array<{ level: number; tag: string }> = [];

  parseGedcom(gedcomContent: string): FamilyMember[] {
    this.reset();
    const lines = gedcomContent.split('\n');

    lines.forEach(line => {
      if (line.trim() === '') return;

      const parsedLine = this.parseLine(line);
      if (!parsedLine) return;

      const { level, tag, pointer, value } = parsedLine;
      this.processLine(level, tag, pointer, value);
    });

    return this.convertToFamilyMemberFormat();
  }

  private parseLine(line: string): {
    level: number;
    tag: string;
    pointer: string | null;
    value: string;
  } | null {
    line = line.trim().replace(/\r$/, '');
    if (!line) return null;

    const levelMatch = line.match(/^(\d+)\s+/);
    if (!levelMatch) return null;

    const level = parseInt(levelMatch[1], 10);
    const rest = line.substring(levelMatch[0].length).trim();

    let pointer = null;
    let tag = '';
    let value = '';

    const pointerMatch = rest.match(/^@([^@]+)@/);
    if (pointerMatch) {
      pointer = pointerMatch[1];
      const afterPointer = rest.substring(pointerMatch[0].length).trim();

      const tagMatch = afterPointer.match(/^(\S+)/);
      if (tagMatch) {
        tag = tagMatch[1];
        value = afterPointer.substring(tagMatch[0].length).trim();
      } else {
        tag = afterPointer;
      }
    } else {
      const firstSpace = rest.indexOf(' ');
      if (firstSpace > 0) {
        tag = rest.substring(0, firstSpace);
        value = rest.substring(firstSpace + 1).trim();
      } else {
        tag = rest;
      }
    }

    return { level, tag, pointer, value };
  }

  private processLine(level: number, tag: string, pointer: string | null, value: string): void {
    while (this.tagStack.length > 0 && this.tagStack[this.tagStack.length - 1].level >= level) {
      this.tagStack.pop();
    }
    this.tagStack.push({ level, tag });

    if (level === 0 && pointer) {
      switch (tag) {
        case 'INDI':
          this.currentRecord = 'INDI';
          this.currentId = pointer;
          this.individuals.set(pointer, { id: pointer });
          break;
        case 'FAM':
          this.currentRecord = 'FAM';
          this.currentId = pointer;
          this.families.set(pointer, { id: pointer });
          break;
        case 'SOUR':
        case 'OBJE':
        case 'SUBM':
          this.currentRecord = tag;
          this.currentId = pointer;
          break;
        default:
          this.currentRecord = null;
      }
      return;
    }

    switch (this.currentRecord) {
      case 'INDI':
        this.processIndividualLine(tag, value);
        break;
      case 'FAM':
        this.processFamilyLine(tag, value);
        break;
    }
  }

  private processIndividualLine(tag: string, value: string): void {
    const individual = this.individuals.get(this.currentId);
    if (!individual) return;

    switch (tag) {
      case 'NAME':
        this.processName(value, individual);
        break;
      case 'SEX':
        individual.sex = (value === 'M' || value === 'F') ? value : undefined;
        break;
      case 'BIRT':
        this.currentTag = 'BIRT';
        if (!individual.birth) individual.birth = {};
        break;
      case 'DEAT':
        this.currentTag = 'DEAT';
        if (!individual.death) individual.death = {};
        break;
      case 'DATE':
        if (this.currentTag === 'BIRT' && individual.birth) {
          individual.birth.date = this.parseDate(value);
        } else if (this.currentTag === 'DEAT' && individual.death) {
          individual.death.date = this.parseDate(value);
        }
        break;
      case 'PLAC':
        if (this.currentTag === 'BIRT' && individual.birth) {
          individual.birth.place = value;
        } else if (this.currentTag === 'DEAT' && individual.death) {
          individual.death.place = value;
        }
        break;
      case 'OCCU':
      case 'OCC':
        individual.occupation = value;
        break;
      case 'RESI':
        if (!individual.residence) individual.residence = [];
        individual.residence.push({ place: value });
        break;
      case 'FAMS':
        if (!individual.families) individual.families = {};
        if (!individual.families.spouse) individual.families.spouse = [];
        const familyId = value.replace(/@/g, '');
        if (!individual.families.spouse.includes(familyId)) {
          individual.families.spouse.push(familyId);
        }
        break;
      case 'FAMC':
        if (!individual.families) individual.families = {};
        if (!individual.families.children) {
          individual.families.children = [];
          const childFamilyId = value.replace(/@/g, '');
          individual.families.children.push(childFamilyId);
        }
        break;
      case 'CONT':
        if (this.currentTag === 'BIRT' && individual.birth?.place) {
          individual.birth.place += ' ' + value;
        } else if (this.currentTag === 'DEAT' && individual.death?.place) {
          individual.death.place += ' ' + value;
        }
        break;
    }
  }

  private processName(nameValue: string, individual: GedcomIndividual): void {
    const trimmedName = nameValue.trim();
    const surnameMatch = trimmedName.match(/\/([^/]+)\//);
    let surname = '';
    let given = '';
    let suffix = '';

    if (surnameMatch) {
      surname = surnameMatch[1].trim();
      const parts = trimmedName.split('/');
      given = parts[0].trim();
      if (parts[2]) suffix = parts[2].trim();
    } else {
      given = trimmedName;
    }

    individual.name = {
      given: given || '',
      surname: surname || '',
      suffix: suffix || ''
    };
  }

  parseDate(dateStr: string): string {
    if (!dateStr) return '';

    const cleanDate = dateStr
      .replace(/^(ABT|BEF|AFT|CAL|EST)\s+/i, '')
      .trim();

    try {
      const date = new Date(cleanDate);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      // continue
    }

    const yearMatch = cleanDate.match(/\b(\d{4})\b/);
    if (yearMatch) return yearMatch[1];

    return cleanDate;
  }

  private processFamilyLine(tag: string, value: string): void {
    const family = this.families.get(this.currentId);
    if (!family) return;

    switch (tag) {
      case 'HUSB':
        family.husband = value.replace(/@/g, '');
        break;
      case 'WIFE':
        family.wife = value.replace(/@/g, '');
        break;
      case 'CHIL':
        if (!family.children) family.children = [];
        const childId = value.replace(/@/g, '');
        if (!family.children.includes(childId)) {
          family.children.push(childId);
        }
        break;
      case 'MARR':
        this.currentTag = 'MARR';
        if (!family.marriage) family.marriage = {};
        break;
      case 'DATE':
        if (this.currentTag === 'MARR' && family.marriage) {
          family.marriage.date = this.parseDate(value);
        }
        break;
      case 'PLAC':
        if (this.currentTag === 'MARR' && family.marriage) {
          family.marriage.place = value;
        }
        break;
    }
  }

  private convertToFamilyMemberFormat(): FamilyMember[] {
    const familyMembers: FamilyMember[] = [];

    this.individuals.forEach((individual, id) => {
      const familyMember: FamilyMember = {
        id,
        data: {
          "first name": individual.name?.given || '',
          "last name": individual.name?.surname || '',
          "birthday": individual.birth?.date || '',
          "gender": individual.sex || 'M',
        },
        rels: {}
      };

      if (individual.death?.date) {
        familyMember.data.death = individual.death.date;
      }
      if (individual.occupation) {
        familyMember.data.occupation = individual.occupation;
      }
      if (individual.birth?.place) {
        familyMember.data.birthPlace = individual.birth.place;
      }
      if (individual.death?.place) {
        familyMember.data.deathPlace = individual.death.place;
      }

      familyMembers.push(familyMember);
    });

    const childToParentMap = new Map<string, {father?: string, mother?: string}>();

    this.families.forEach(family => {
      if (family.children) {
        family.children.forEach(childId => {
          if (!childToParentMap.has(childId)) {
            childToParentMap.set(childId, {
              father: family.husband,
              mother: family.wife
            });
          }
        });
      }
    });

    familyMembers.forEach(member => {
      const parents = childToParentMap.get(member.id);
      if (parents) {
        member.rels.parents = [];
        if (parents.father) member.rels.parents.push(parents.father);
        if (parents.mother) member.rels.parents.push(parents.mother);
      }

      this.families.forEach(family => {
        if (family.husband === member.id && family.wife) {
          if (!member.rels.spouses) member.rels.spouses = [];
          if (!member.rels.spouses.includes(family.wife)) {
            member.rels.spouses.push(family.wife);
          }
        } else if (family.wife === member.id && family.husband) {
          if (!member.rels.spouses) member.rels.spouses = [];
          if (!member.rels.spouses.includes(family.husband)) {
            member.rels.spouses.push(family.husband);
          }
        }
      });
    });

    familyMembers.forEach(parent => {
      this.families.forEach(family => {
        if ((family.husband === parent.id || family.wife === parent.id) && family.children) {
          if (!parent.rels.children) parent.rels.children = [];
          family.children.forEach(childId => {
            if (!parent.rels.children!.includes(childId)) {
              parent.rels.children!.push(childId);
            }
          });
        }
      });
    });

    return familyMembers;
  }

  reset(): void {
    this.individuals.clear();
    this.families.clear();
    this.currentRecord = null;
    this.currentId = '';
    this.currentTag = '';
    this.tagStack = [];
  }

  /** Extract marriage events with names resolved */
  getMarriageEvents(): MarriageEvent[] {
    const events: MarriageEvent[] = [];

    this.families.forEach((family) => {
      if (!family.marriage?.date) return;

      const yearMatch = family.marriage.date.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
      if (!yearMatch) return;

      const year = parseInt(yearMatch[1]);

      const husb = family.husband ? this.individuals.get(family.husband) : undefined;
      const wife = family.wife ? this.individuals.get(family.wife) : undefined;

      const husbandName = husb
        ? [husb.name?.given, husb.name?.surname].filter(Boolean).join(' ') || 'Unknown'
        : 'Unknown';
      const wifeName = wife
        ? [wife.name?.given, wife.name?.surname].filter(Boolean).join(' ') || 'Unknown'
        : 'Unknown';

      events.push({
        year,
        husbandName,
        wifeName,
        place: family.marriage.place,
      });
    });

    return events;
  }
}

export async function parseGedcomFile(file: File): Promise<{ members: FamilyMember[]; marriages: MarriageEvent[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parser = new AncestryGedcomParser();
        const familyMembers = parser.parseGedcom(content);

        if (familyMembers.length === 0) {
          throw new Error('No valid family data found in GEDCOM file');
        }

        const marriages = parser.getMarriageEvents();

        console.log('Parsed', familyMembers.length, 'family members');
        console.log('Parsed', marriages.length, 'marriage events');

        resolve({ members: familyMembers, marriages });
      } catch (error) {
        console.error('Error parsing GEDCOM:', error);
        reject(new Error('Failed to parse GEDCOM file. Please ensure it\'s a valid GEDCOM 5.5 file.'));
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error));
    };

    reader.readAsText(file);
  });
}

export function getGedcomStats(gedcomContent: string): {
  individualCount: number;
  familyCount: number;
  sampleIndividuals: Array<{id: string, name: string}>
} {
  const parser = new AncestryGedcomParser();
  const data = parser.parseGedcom(gedcomContent);

  const familyCount = parser.families?.size || 0;

  const sampleIndividuals = data.slice(0, 5).map(ind => ({
    id: ind.id,
    name: `${ind.data["first name"]} ${ind.data["last name"]}`.trim()
  }));

  return {
    individualCount: data.length,
    familyCount,
    sampleIndividuals
  };
}