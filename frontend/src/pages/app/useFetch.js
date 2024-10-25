import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        setTimeout(() => {
            fetch(url, { signal: abortController.signal })
                .then((res) => {
                    if (!res.ok) {
                        throw Error('Could not fetch data for that resource.');
                    }
                    return res.json();
                })
                .then((data) => {
                    setIsPending(false);
                    setData(data);
                    setError(null);
                })
                .catch((err) => {
                    if (err.name === 'AbortError') {
                        console.log('Fetch aborted');
                    } else {
                        setIsPending(false);
                        setError(err.message);
                    }
                });
        }, 2000);

        return () => abortController.abort();
    }, [url]);

    return { data, isPending, error };
};

export default useFetch;
