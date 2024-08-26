export type Character = {
    id: number;
    name: string;
    description: string;
    modified: string;
    thumbnail: {
      path: string;
      extension: string;
    };
    resourceURI: string;
    comics: {
      available: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
      }>;
      returned: number;
    };
    series: {
      available: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
      }>;
      returned: number;
    };
    stories: {
      available: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
        type: string;
      }>;
      returned: number;
    };
    events: {
      available: number;
      collectionURI: string;
      items: Array<any>;
      returned: number;
    };
    urls: Array<any>;
  };

export type CharacterCardProps = Pick<Character, 'id' | 'name' | 'description' | 'thumbnail'>;