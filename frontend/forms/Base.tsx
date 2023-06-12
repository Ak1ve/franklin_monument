import classNames from "classnames";


export default function Base({ sectionHeader, subheader, children, className }: { children?: any, sectionHeader: string | any, subheader?: string | any, className?: string }) {
    return (
        <main className={className}>
            <h1 className="text-center text-5xl">{sectionHeader}</h1>
            <div className="text-center italic">{subheader}</div>
            {children}
        </main>
    );
}

export function Section({ className, children}: { children?: any, className?: string}) {
    return (
        <div className={"flex w-full justify-center " + className}>
            <div className="bg-white shadow shadow-gray-200 w-8/12 rounded-xl drop-shadow-xl">
                <div className="px-3">
                    {children}
                </div>
            </div>
        </div>);
}