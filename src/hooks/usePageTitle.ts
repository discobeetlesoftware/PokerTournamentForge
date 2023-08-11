import { useEffect } from "react";

export const usePageTitle = (title: string, elementName?: string) => {
    useEffect(() => {
        const elementTitle = elementName && elementName.length > 0 ? ` (${elementName})` : '';
        document.title = `${title}${elementTitle} | Poker Tournament Forge`;
    }, [title, elementName]);

    return null;
}
