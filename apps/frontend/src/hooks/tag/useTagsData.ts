import { useEffect, useState, Dispatch, SetStateAction } from 'react';

import { Tag } from 'generated/sdk';
import { useDataApi } from 'hooks/common/useDataApi';

export function useTagsData({ category }: { category: string }): {
  loadingTags: boolean;
  tags: Tag[];
  setTagsWithLoading: Dispatch<SetStateAction<Tag[]>>;
} {
  const api = useDataApi();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  const setTagsWithLoading = (data: SetStateAction<Tag[]>) => {
    setLoadingTags(true);
    setTags(data);
    setLoadingTags(false);
  };

  useEffect(() => {
    let unmounted = false;

    setLoadingTags(true);

    api()
      .getTags({ category })
      .then((data) => {
        if (unmounted) {
          return;
        }

        if (data.tags) {
          setTags(
            data.tags.map((tag) => {
              return {
                ...tag,
              };
            })
          );
        }
        setLoadingTags(false);
      });

    return () => {
      unmounted = true;
    };
  }, [category, api]);

  return {
    loadingTags,
    tags,
    setTagsWithLoading,
  };
}
