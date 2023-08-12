import { ReactNode } from "react";

export const ExpandableElementView = (props: { isOpen: boolean, children: ReactNode }) => {
    const { isOpen, children } = props;
    return (
        <>
            {isOpen && <div className='element' >{children}</div>}
        </>
    );
};
