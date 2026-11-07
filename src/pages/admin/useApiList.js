import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api/client.js';

export function useApiList(path) {
  const [state, setState] = useState({ data: null, error: '' });

  const reload = useCallback(
    () =>
      api(path)
        .then((data) => setState({ data, error: '' }))
        .catch((err) => setState((prev) => ({ ...prev, error: err.message }))),
    [path]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
