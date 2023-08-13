import { useHref } from "react-router-dom";

export const useSharableLinkBuilder = () => {
    let url = window.location.origin;
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    url += useHref('/');
    return (input: string = '') => {
        return `${url}${input}`;
    };
};
