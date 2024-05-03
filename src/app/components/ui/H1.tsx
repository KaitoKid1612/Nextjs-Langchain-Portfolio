import { cn } from "@/app/lib/utils";

export function H1(props: React.HTMLProps<HTMLHeadingElement>) {
    return <h1 
    {...props} 
    className={cn("text-3xl font-bold -tracking-tight", props.className)} 
    />;
}