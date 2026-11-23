import type {Metadata} from "next";
import "./globals.css";
import SupportWidget from "@/components/support-widget";
export const metadata:Metadata={title:"Mrs. Shaimaa Sulaiman | SAT English Academy",description:"A focused SAT English learning experience with structured courses, guided practice and student progress tracking.",applicationName:"SAT English Academy",robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<SupportWidget/></body></html>;}