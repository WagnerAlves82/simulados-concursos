@echo off
echo Criando componentes UI faltando...

REM ===== CARD COMPONENT (PRINCIPAL QUE ESTAVA FALTANDO) =====
echo. > src\components\ui\card.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo const Card = React.forwardRef^<
echo   HTMLDivElement,
echo   React.HTMLAttributes^<HTMLDivElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     className={cn^(
echo       "rounded-lg border bg-card text-card-foreground shadow-sm",
echo       className
echo     ^)}
echo     {...props}
echo   /^>
echo ^)^)
echo Card.displayName = "Card"
echo.
echo const CardHeader = React.forwardRef^<
echo   HTMLDivElement,
echo   React.HTMLAttributes^<HTMLDivElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     className={cn^("flex flex-col space-y-1.5 p-6", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo CardHeader.displayName = "CardHeader"
echo.
echo const CardTitle = React.forwardRef^<
echo   HTMLParagraphElement,
echo   React.HTMLAttributes^<HTMLHeadingElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<h3
echo     ref={ref}
echo     className={cn^(
echo       "text-2xl font-semibold leading-none tracking-tight",
echo       className
echo     ^)}
echo     {...props}
echo   /^>
echo ^)^)
echo CardTitle.displayName = "CardTitle"
echo.
echo const CardDescription = React.forwardRef^<
echo   HTMLParagraphElement,
echo   React.HTMLAttributes^<HTMLParagraphElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<p
echo     ref={ref}
echo     className={cn^("text-sm text-muted-foreground", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo CardDescription.displayName = "CardDescription"
echo.
echo const CardContent = React.forwardRef^<
echo   HTMLDivElement,
echo   React.HTMLAttributes^<HTMLDivElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<div ref={ref} className={cn^("p-6 pt-0", className^)} {...props} /^>
echo ^)^)
echo CardContent.displayName = "CardContent"
echo.
echo const CardFooter = React.forwardRef^<
echo   HTMLDivElement,
echo   React.HTMLAttributes^<HTMLDivElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     className={cn^("flex items-center p-6 pt-0", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo CardFooter.displayName = "CardFooter"
echo.
echo export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
) > src\components\ui\card.tsx

REM ===== BUTTON COMPONENT (PRINCIPAL) =====
echo. > src\components\ui\button.tsx
(
echo import * as React from "react"
echo import { Slot } from "@radix-ui/react-slot"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { cn } from "@/lib/utils"
echo.
echo const buttonVariants = cva^(
echo   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
echo   {
echo     variants: {
echo       variant: {
echo         default: "bg-primary text-primary-foreground hover:bg-primary/90",
echo         destructive:
echo           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
echo         outline:
echo           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
echo         secondary:
echo           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
echo         ghost: "hover:bg-accent hover:text-accent-foreground",
echo         link: "text-primary underline-offset-4 hover:underline",
echo       },
echo       size: {
echo         default: "h-10 px-4 py-2",
echo         sm: "h-9 rounded-md px-3",
echo         lg: "h-11 rounded-md px-8",
echo         icon: "h-10 w-10",
echo       },
echo     },
echo     defaultVariants: {
echo       variant: "default",
echo       size: "default",
echo     },
echo   }
echo ^)
echo.
echo export interface ButtonProps
echo   extends React.ButtonHTMLAttributes^<HTMLButtonElement^>,
echo     VariantProps^<typeof buttonVariants^> {
echo   asChild?: boolean
echo }
echo.
echo const Button = React.forwardRef^<HTMLButtonElement, ButtonProps^>^(
echo   ^({ className, variant, size, asChild = false, ...props }, ref^) =^> {
echo     const Comp = asChild ? Slot : "button"
echo     return ^(
echo       ^<Comp
echo         className={cn^(buttonVariants^({ variant, size, className }^)^)}
echo         ref={ref}
echo         {...props}
echo       /^>
echo     ^)
echo   }
echo ^)
echo Button.displayName = "Button"
echo.
echo export { Button, buttonVariants }
) > src\components\ui\button.tsx

REM ===== BADGE COMPONENT =====
echo. > src\components\ui\badge.tsx
(
echo import * as React from "react"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { cn } from "@/lib/utils"
echo.
echo const badgeVariants = cva^(
echo   "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
echo   {
echo     variants: {
echo       variant: {
echo         default:
echo           "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
echo         secondary:
echo           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
echo         destructive:
echo           "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
echo         outline: "text-foreground",
echo       },
echo     },
echo     defaultVariants: {
echo       variant: "default",
echo     },
echo   }
echo ^)
echo.
echo export interface BadgeProps
echo   extends React.HTMLAttributes^<HTMLDivElement^>,
echo     VariantProps^<typeof badgeVariants^> {}
echo.
echo function Badge^({ className, variant, ...props }: BadgeProps^) {
echo   return ^(
echo     ^<div className={cn^(badgeVariants^({ variant }^), className^)} {...props} /^>
echo   ^)
echo }
echo.
echo export { Badge, badgeVariants }
) > src\components\ui\badge.tsx

REM ===== INPUT COMPONENT =====
echo. > src\components\ui\input.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface InputProps
echo   extends React.InputHTMLAttributes^<HTMLInputElement^> {}
echo.
echo const Input = React.forwardRef^<HTMLInputElement, InputProps^>^(
echo   ^({ className, type, ...props }, ref^) =^> {
echo     return ^(
echo       ^<input
echo         type={type}
echo         className={cn^(
echo           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
echo           className
echo         ^)}
echo         ref={ref}
echo         {...props}
echo       /^>
echo     ^)
echo   }
echo ^)
echo Input.displayName = "Input"
echo.
echo export { Input }
) > src\components\ui\input.tsx

REM ===== LABEL COMPONENT (Versão Simples) =====
echo. > src\components\ui\label.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface LabelProps
echo   extends React.LabelHTMLAttributes^<HTMLLabelElement^> {}
echo.
echo const Label = React.forwardRef^<HTMLLabelElement, LabelProps^>^(
echo   ^({ className, ...props }, ref^) =^> ^(
echo     ^<label
echo       ref={ref}
echo       className={cn^(
echo         "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
echo         className
echo       ^)}
echo       {...props}
echo     /^>
echo   ^)
echo ^)
echo Label.displayName = "Label"
echo.
echo export { Label }
) > src\components\ui\label.tsx

REM ===== PROGRESS COMPONENT (Versão Simples) =====
echo. > src\components\ui\progress.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface ProgressProps
echo   extends React.HTMLAttributes^<HTMLDivElement^> {
echo   value?: number
echo }
echo.
echo const Progress = React.forwardRef^<HTMLDivElement, ProgressProps^>^(
echo   ^({ className, value, ...props }, ref^) =^> ^(
echo     ^<div
echo       ref={ref}
echo       className={cn^(
echo         "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
echo         className
echo       ^)}
echo       {...props}
echo     ^>
echo       ^<div
echo         className="h-full w-full flex-1 bg-primary transition-all"
echo         style={{ transform: `translateX^(-${100 - ^(value ^|^| 0^)}%%^)` }}
echo       /^>
echo     ^</div^>
echo   ^)
echo ^)
echo Progress.displayName = "Progress"
echo.
echo export { Progress }
) > src\components\ui\progress.tsx

REM ===== ALERT COMPONENT =====
echo. > src\components\ui\alert.tsx
(
echo import * as React from "react"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { cn } from "@/lib/utils"
echo.
echo const alertVariants = cva^(
echo   "relative w-full rounded-lg border p-4 [^&^>svg~*]:pl-7 [^&^>svg+div]:translate-y-[-3px] [^&^>svg]:absolute [^&^>svg]:left-4 [^&^>svg]:top-4 [^&^>svg]:text-foreground",
echo   {
echo     variants: {
echo       variant: {
echo         default: "bg-background text-foreground",
echo         destructive:
echo           "border-destructive/50 text-destructive dark:border-destructive [^&^>svg]:text-destructive",
echo       },
echo     },
echo     defaultVariants: {
echo       variant: "default",
echo     },
echo   }
echo ^)
echo.
echo const Alert = React.forwardRef^<
echo   HTMLDivElement,
echo   React.HTMLAttributes^<HTMLDivElement^> ^& VariantProps^<typeof alertVariants^>
echo ^>^(^({ className, variant, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     role="alert"
echo     className={cn^(alertVariants^({ variant }^), className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo Alert.displayName = "Alert"
echo.
echo const AlertDescription = React.forwardRef^<
echo   HTMLParagraphElement,
echo   React.HTMLAttributes^<HTMLParagraphElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     className={cn^("text-sm [^&_p]:leading-relaxed", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo AlertDescription.displayName = "AlertDescription"
echo.
echo export { Alert, AlertDescription }
) > src\components\ui\alert.tsx

REM ===== TEXTAREA COMPONENT =====
echo. > src\components\ui\textarea.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface TextareaProps
echo   extends React.TextareaHTMLAttributes^<HTMLTextAreaElement^> {}
echo.
echo const Textarea = React.forwardRef^<HTMLTextAreaElement, TextareaProps^>^(
echo   ^({ className, ...props }, ref^) =^> {
echo     return ^(
echo       ^<textarea
echo         className={cn^(
echo           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
echo           className
echo         ^)}
echo         ref={ref}
echo         {...props}
echo       /^>
echo     ^)
echo   }
echo ^)
echo Textarea.displayName = "Textarea"
echo.
echo export { Textarea }
) > src\components\ui\textarea.tsx

REM ===== SELECT COMPONENT (Versão Simples HTML) =====
echo. > src\components\ui\select.tsx
(
echo import * as React from "react"
echo import { ChevronDown } from "lucide-react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface SelectProps
echo   extends React.SelectHTMLAttributes^<HTMLSelectElement^> {}
echo.
echo const Select = React.forwardRef^<HTMLSelectElement, SelectProps^>^(
echo   ^({ className, children, ...props }, ref^) =^> {
echo     return ^(
echo       ^<div className="relative"^>
echo         ^<select
echo           className={cn^(
echo             "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
echo             className
echo           ^)}
echo           ref={ref}
echo           {...props}
echo         ^>
echo           {children}
echo         ^</select^>
echo         ^<ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" /^>
echo       ^</div^>
echo     ^)
echo   }
echo ^)
echo Select.displayName = "Select"
echo.
echo // Componentes compatíveis para shadcn
echo const SelectContent = ^({ children }: { children: React.ReactNode }^) =^> ^<^>{children}^</^>
echo const SelectItem = ^({ children, ...props }: React.OptionHTMLAttributes^<HTMLOptionElement^>^) =^> ^(
echo   ^<option {...props}^>{children}^</option^>
echo ^)
echo const SelectTrigger = Select
echo const SelectValue = ^({ placeholder }: { placeholder?: string }^) =^> ^<option value=""^>{placeholder}^</option^>
echo.
echo export {
echo   Select,
echo   SelectContent,
echo   SelectItem,
echo   SelectTrigger,
echo   SelectValue,
echo }
) > src\components\ui\select.tsx

REM ===== USE-TOAST HOOK (Versão Simples) =====
echo. > src\components\ui\use-toast.ts
(
echo import * as React from "react"
echo.
echo type ToasterToast = {
echo   id: string
echo   title?: React.ReactNode
echo   description?: React.ReactNode
echo   variant?: "default" ^| "destructive"
echo }
echo.
echo const listeners: Array^<^(state: { toasts: ToasterToast[] }^) =^> void^> = []
echo let memoryState: { toasts: ToasterToast[] } = { toasts: [] }
echo let count = 0
echo.
echo function genId^(^) {
echo   count = ^(count + 1^) %% Number.MAX_SAFE_INTEGER
echo   return count.toString^(^)
echo }
echo.
echo function dispatch^(toast: ToasterToast^) {
echo   memoryState = { toasts: [toast, ...memoryState.toasts].slice^(0, 5^) }
echo   listeners.forEach^(^(listener^) =^> listener^(memoryState^)^)
echo   
echo   // Auto remove after 5 seconds
echo   setTimeout^(^(^) =^> {
echo     memoryState = { 
echo       toasts: memoryState.toasts.filter^(^(t^) =^> t.id !== toast.id^) 
echo     }
echo     listeners.forEach^(^(listener^) =^> listener^(memoryState^)^)
echo   }, 5000^)
echo }
echo.
echo export function toast^({ ...props }: Omit^<ToasterToast, "id"^>^) {
echo   const id = genId^(^)
echo   const toastItem = { ...props, id }
echo   dispatch^(toastItem^)
echo   
echo   return {
echo     id,
echo     dismiss: ^(^) =^> {
echo       memoryState = { 
echo         toasts: memoryState.toasts.filter^(^(t^) =^> t.id !== id^) 
echo       }
echo       listeners.forEach^(^(listener^) =^> listener^(memoryState^)^)
echo     },
echo     update: ^(newProps: Partial^<ToasterToast^>^) =^> {
echo       const updatedToast = { ...toastItem, ...newProps }
echo       memoryState = {
echo         toasts: memoryState.toasts.map^(^(t^) =^> t.id === id ? updatedToast : t^)
echo       }
echo       listeners.forEach^(^(listener^) =^> listener^(memoryState^)^)
echo     }
echo   }
echo }
echo.
echo export function useToast^(^) {
echo   const [state, setState] = React.useState^(memoryState^)
echo.
echo   React.useEffect^(^(^) =^> {
echo     listeners.push^(setState^)
echo     return ^(^) =^> {
echo       const index = listeners.indexOf^(setState^)
echo       if ^(index ^> -1^) listeners.splice^(index, 1^)
echo     }
echo   }, []^)
echo.
echo   return {
echo     ...state,
echo     toast,
echo     dismiss: ^(toastId?: string^) =^> {
echo       if ^(toastId^) {
echo         memoryState = { 
echo           toasts: memoryState.toasts.filter^(^(t^) =^> t.id !== toastId^) 
echo         }
echo       } else {
echo         memoryState = { toasts: [] }
echo       }
echo       listeners.forEach^(^(listener^) =^> listener^(memoryState^)^)
echo     }
echo   }
echo }
) > src\components\ui\use-toast.ts

REM ===== TOASTER COMPONENT (Versão Simples) =====
echo. > src\components\ui\toaster.tsx
(
echo "use client"
echo.
echo import { useToast } from "@/components/ui/use-toast"
echo import { X } from "lucide-react"
echo import { cn } from "@/lib/utils"
echo.
echo export function Toaster^(^) {
echo   const { toasts, dismiss } = useToast^(^)
echo.
echo   return ^(
echo     ^<div className="fixed bottom-0 right-0 z-[100] w-full max-w-sm p-4 space-y-2"^>
echo       {toasts.map^(^(toast^) =^> ^(
echo         ^<div
echo           key={toast.id}
echo           className={cn^(
echo             "relative flex w-full items-center space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
echo             toast.variant === "destructive" 
echo               ? "border-red-500 bg-red-50 text-red-900" 
echo               : "border-gray-200 bg-white text-gray-900"
echo           ^)}
echo         ^>
echo           ^<div className="grid gap-1"^>
echo             {toast.title ^&^& ^<div className="text-sm font-semibold"^>{toast.title}^</div^>}
echo             {toast.description ^&^& ^<div className="text-sm opacity-90"^>{toast.description}^</div^>}
echo           ^</div^>
echo           ^<button
echo             className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 group-hover:opacity-100"
echo             onClick={^(^) =^> dismiss^(toast.id^)}
echo           ^>
echo             ^<X className="h-4 w-4" /^>
echo           ^</button^>
echo         ^</div^>
echo       ^)^)}
echo     ^</div^>
echo   ^)
echo }
) > src\components\ui\toaster.tsx

echo.
echo ===== TODOS os componentes UI criados com sucesso! =====
echo.
echo Agora instale as dependências necessárias:
echo npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
echo.
echo Depois execute: npm run dev
echo.

REM ===== BADGE COMPONENT =====
echo. > src\components\ui\badge.tsx
(
echo import * as React from "react"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { cn } from "@/lib/utils"
echo.
echo const badgeVariants = cva^(
echo   "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
echo   {
echo     variants: {
echo       variant: {
echo         default:
echo           "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
echo         secondary:
echo           "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
echo         destructive:
echo           "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
echo         outline: "text-foreground",
echo       },
echo     },
echo     defaultVariants: {
echo       variant: "default",
echo     },
echo   }
echo ^)
echo.
echo export interface BadgeProps
echo   extends React.HTMLAttributes^<HTMLDivElement^>,
echo     VariantProps^<typeof badgeVariants^> {}
echo.
echo function Badge^({ className, variant, ...props }: BadgeProps^) {
echo   return ^(
echo     ^<div className={cn^(badgeVariants^({ variant }^), className^)} {...props} /^>
echo   ^)
echo }
echo.
echo export { Badge, badgeVariants }
) > src\components\ui\badge.tsx

REM ===== INPUT COMPONENT =====
echo. > src\components\ui\input.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface InputProps
echo   extends React.InputHTMLAttributes^<HTMLInputElement^> {}
echo.
echo const Input = React.forwardRef^<HTMLInputElement, InputProps^>^(
echo   ^({ className, type, ...props }, ref^) =^> {
echo     return ^(
echo       ^<input
echo         type={type}
echo         className={cn^(
echo           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
echo           className
echo         ^)}
echo         ref={ref}
echo         {...props}
echo       /^>
echo     ^)
echo   }
echo ^)
echo Input.displayName = "Input"
echo.
echo export { Input }
) > src\components\ui\input.tsx

REM ===== LABEL COMPONENT =====
echo. > src\components\ui\label.tsx
(
echo import * as React from "react"
echo import * as LabelPrimitive from "@radix-ui/react-label"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { cn } from "@/lib/utils"
echo.
echo const labelVariants = cva^(
echo   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
echo ^)
echo.
echo const Label = React.forwardRef^<
echo   React.ElementRef^<typeof LabelPrimitive.Root^>,
echo   React.ComponentPropsWithoutRef^<typeof LabelPrimitive.Root^> ^&
echo     VariantProps^<typeof labelVariants^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<LabelPrimitive.Root
echo     ref={ref}
echo     className={cn^(labelVariants^(^), className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo Label.displayName = LabelPrimitive.Root.displayName
echo.
echo export { Label }
) > src\components\ui\label.tsx

REM ===== PROGRESS COMPONENT =====
echo. > src\components\ui\progress.tsx
(
echo import * as React from "react"
echo import * as ProgressPrimitive from "@radix-ui/react-progress"
echo import { cn } from "@/lib/utils"
echo.
echo const Progress = React.forwardRef^<
echo   React.ElementRef^<typeof ProgressPrimitive.Root^>,
echo   React.ComponentPropsWithoutRef^<typeof ProgressPrimitive.Root^>
echo ^>^(^({ className, value, ...props }, ref^) =^> ^(
echo   ^<ProgressPrimitive.Root
echo     ref={ref}
echo     className={cn^(
echo       "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
echo       className
echo     ^)}
echo     {...props}
echo   ^>
echo     ^<ProgressPrimitive.Indicator
echo       className="h-full w-full flex-1 bg-primary transition-all"
echo       style={{ transform: `translateX^(-${100 - ^(value ^|^| 0^)}%%^)` }}
echo     /^>
echo   ^</ProgressPrimitive.Root^>
echo ^)^)
echo Progress.displayName = ProgressPrimitive.Root.displayName
echo.
echo export { Progress }
) > src\components\ui\progress.tsx

REM ===== ALERT COMPONENT =====
echo. > src\components\ui\alert.tsx
(
echo import * as React from "react"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { cn } from "@/lib/utils"
echo.
echo const alertVariants = cva^(
echo   "relative w-full rounded-lg border p-4 [^&^>svg~*]:pl-7 [^&^>svg+div]:translate-y-[-3px] [^&^>svg]:absolute [^&^>svg]:left-4 [^&^>svg]:top-4 [^&^>svg]:text-foreground",
echo   {
echo     variants: {
echo       variant: {
echo         default: "bg-background text-foreground",
echo         destructive:
echo           "border-destructive/50 text-destructive dark:border-destructive [^&^>svg]:text-destructive",
echo       },
echo     },
echo     defaultVariants: {
echo       variant: "default",
echo     },
echo   }
echo ^)
echo.
echo const Alert = React.forwardRef^<
echo   HTMLDivElement,
echo   React.HTMLAttributes^<HTMLDivElement^> ^& VariantProps^<typeof alertVariants^>
echo ^>^(^({ className, variant, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     role="alert"
echo     className={cn^(alertVariants^({ variant }^), className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo Alert.displayName = "Alert"
echo.
echo const AlertDescription = React.forwardRef^<
echo   HTMLParagraphElement,
echo   React.HTMLAttributes^<HTMLParagraphElement^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<div
echo     ref={ref}
echo     className={cn^("text-sm [^&_p]:leading-relaxed", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo AlertDescription.displayName = "AlertDescription"
echo.
echo export { Alert, AlertDescription }
) > src\components\ui\alert.tsx

REM ===== TEXTAREA COMPONENT =====
echo. > src\components\ui\textarea.tsx
(
echo import * as React from "react"
echo import { cn } from "@/lib/utils"
echo.
echo export interface TextareaProps
echo   extends React.TextareaHTMLAttributes^<HTMLTextAreaElement^> {}
echo.
echo const Textarea = React.forwardRef^<HTMLTextAreaElement, TextareaProps^>^(
echo   ^({ className, ...props }, ref^) =^> {
echo     return ^(
echo       ^<textarea
echo         className={cn^(
echo           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
echo           className
echo         ^)}
echo         ref={ref}
echo         {...props}
echo       /^>
echo     ^)
echo   }
echo ^)
echo Textarea.displayName = "Textarea"
echo.
echo export { Textarea }
) > src\components\ui\textarea.tsx

REM ===== SELECT COMPONENT =====
echo. > src\components\ui\select.tsx
(
echo import * as React from "react"
echo import * as SelectPrimitive from "@radix-ui/react-select"
echo import { Check, ChevronDown, ChevronUp } from "lucide-react"
echo import { cn } from "@/lib/utils"
echo.
echo const Select = SelectPrimitive.Root
echo const SelectGroup = SelectPrimitive.Group
echo const SelectValue = SelectPrimitive.Value
echo.
echo const SelectTrigger = React.forwardRef^<
echo   React.ElementRef^<typeof SelectPrimitive.Trigger^>,
echo   React.ComponentPropsWithoutRef^<typeof SelectPrimitive.Trigger^>
echo ^>^(^({ className, children, ...props }, ref^) =^> ^(
echo   ^<SelectPrimitive.Trigger
echo     ref={ref}
echo     className={cn^(
echo       "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [^&^>span]:line-clamp-1",
echo       className
echo     ^)}
echo     {...props}
echo   ^>
echo     {children}
echo     ^<SelectPrimitive.Icon asChild^>
echo       ^<ChevronDown className="h-4 w-4 opacity-50" /^>
echo     ^</SelectPrimitive.Icon^>
echo   ^</SelectPrimitive.Trigger^>
echo ^)^)
echo SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
echo.
echo const SelectScrollUpButton = React.forwardRef^<
echo   React.ElementRef^<typeof SelectPrimitive.ScrollUpButton^>,
echo   React.ComponentPropsWithoutRef^<typeof SelectPrimitive.ScrollUpButton^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<SelectPrimitive.ScrollUpButton
echo     ref={ref}
echo     className={cn^(
echo       "flex cursor-default items-center justify-center py-1",
echo       className
echo     ^)}
echo     {...props}
echo   ^>
echo     ^<ChevronUp className="h-4 w-4" /^>
echo   ^</SelectPrimitive.ScrollUpButton^>
echo ^)^)
echo SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
echo.
echo const SelectScrollDownButton = React.forwardRef^<
echo   React.ElementRef^<typeof SelectPrimitive.ScrollDownButton^>,
echo   React.ComponentPropsWithoutRef^<typeof SelectPrimitive.ScrollDownButton^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<SelectPrimitive.ScrollDownButton
echo     ref={ref}
echo     className={cn^(
echo       "flex cursor-default items-center justify-center py-1",
echo       className
echo     ^)}
echo     {...props}
echo   ^>
echo     ^<ChevronDown className="h-4 w-4" /^>
echo   ^</SelectPrimitive.ScrollDownButton^>
echo ^)^)
echo SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName
echo.
echo const SelectContent = React.forwardRef^<
echo   React.ElementRef^<typeof SelectPrimitive.Content^>,
echo   React.ComponentPropsWithoutRef^<typeof SelectPrimitive.Content^>
echo ^>^(^({ className, children, position = "popper", ...props }, ref^) =^> ^(
echo   ^<SelectPrimitive.Portal^>
echo     ^<SelectPrimitive.Content
echo       ref={ref}
echo       className={cn^(
echo         "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
echo         position === "popper" ^&^&
echo           "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
echo         className
echo       ^)}
echo       position={position}
echo       {...props}
echo     ^>
echo       ^<SelectScrollUpButton /^>
echo       ^<SelectPrimitive.Viewport
echo         className={cn^(
echo           "p-1",
echo           position === "popper" ^&^&
echo             "h-[var^(--radix-select-trigger-height^)] w-full min-w-[var^(--radix-select-trigger-width^)]"
echo         ^)}
echo       ^>
echo         {children}
echo       ^</SelectPrimitive.Viewport^>
echo       ^<SelectScrollDownButton /^>
echo     ^</SelectPrimitive.Content^>
echo   ^</SelectPrimitive.Portal^>
echo ^)^)
echo SelectContent.displayName = SelectPrimitive.Content.displayName
echo.
echo const SelectItem = React.forwardRef^<
echo   React.ElementRef^<typeof SelectPrimitive.Item^>,
echo   React.ComponentPropsWithoutRef^<typeof SelectPrimitive.Item^>
echo ^>^(^({ className, children, ...props }, ref^) =^> ^(
echo   ^<SelectPrimitive.Item
echo     ref={ref}
echo     className={cn^(
echo       "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
echo       className
echo     ^)}
echo     {...props}
echo   ^>
echo     ^<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"^>
echo       ^<SelectPrimitive.ItemIndicator^>
echo         ^<Check className="h-4 w-4" /^>
echo       ^</SelectPrimitive.ItemIndicator^>
echo     ^</span^>
echo.
echo     ^<SelectPrimitive.ItemText^>{children}^</SelectPrimitive.ItemText^>
echo   ^</SelectPrimitive.Item^>
echo ^)^)
echo SelectItem.displayName = SelectPrimitive.Item.displayName
echo.
echo export {
echo   Select,
echo   SelectGroup,
echo   SelectValue,
echo   SelectTrigger,
echo   SelectContent,
echo   SelectItem,
echo   SelectScrollUpButton,
echo   SelectScrollDownButton,
echo }
) > src\components\ui\select.tsx

REM ===== TOAST COMPONENT =====
echo. > src\components\ui\toast.tsx
(
echo import * as React from "react"
echo import * as ToastPrimitives from "@radix-ui/react-toast"
echo import { cva, type VariantProps } from "class-variance-authority"
echo import { X } from "lucide-react"
echo import { cn } from "@/lib/utils"
echo.
echo const ToastProvider = ToastPrimitives.Provider
echo.
echo const ToastViewport = React.forwardRef^<
echo   React.ElementRef^<typeof ToastPrimitives.Viewport^>,
echo   React.ComponentPropsWithoutRef^<typeof ToastPrimitives.Viewport^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<ToastPrimitives.Viewport
echo     ref={ref}
echo     className={cn^(
echo       "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
echo       className
echo     ^)}
echo     {...props}
echo   /^>
echo ^)^)
echo ToastViewport.displayName = ToastPrimitives.Viewport.displayName
echo.
echo const toastVariants = cva^(
echo   "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var^(--radix-toast-swipe-end-x^)] data-[swipe=move]:translate-x-[var^(--radix-toast-swipe-move-x^)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
echo   {
echo     variants: {
echo       variant: {
echo         default: "border bg-background text-foreground",
echo         destructive:
echo           "destructive group border-destructive bg-destructive text-destructive-foreground",
echo       },
echo     },
echo     defaultVariants: {
echo       variant: "default",
echo     },
echo   }
echo ^)
echo.
echo const Toast = React.forwardRef^<
echo   React.ElementRef^<typeof ToastPrimitives.Root^>,
echo   React.ComponentPropsWithoutRef^<typeof ToastPrimitives.Root^> ^&
echo     VariantProps^<typeof toastVariants^>
echo ^>^(^({ className, variant, ...props }, ref^) =^> {
echo   return ^(
echo     ^<ToastPrimitives.Root
echo       ref={ref}
echo       className={cn^(toastVariants^({ variant }^), className^)}
echo       {...props}
echo     /^>
echo   ^)
echo }^)
echo Toast.displayName = ToastPrimitives.Root.displayName
echo.
echo const ToastAction = React.forwardRef^<
echo   React.ElementRef^<typeof ToastPrimitives.Action^>,
echo   React.ComponentPropsWithoutRef^<typeof ToastPrimitives.Action^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<ToastPrimitives.Action
echo     ref={ref}
echo     className={cn^(
echo       "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
echo       className
echo     ^)}
echo     {...props}
echo   /^>
echo ^)^)
echo ToastAction.displayName = ToastPrimitives.Action.displayName
echo.
echo const ToastClose = React.forwardRef^<
echo   React.ElementRef^<typeof ToastPrimitives.Close^>,
echo   React.ComponentPropsWithoutRef^<typeof ToastPrimitives.Close^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<ToastPrimitives.Close
echo     ref={ref}
echo     className={cn^(
echo       "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
echo       className
echo     ^)}
echo     toast-close=""
echo     {...props}
echo   ^>
echo     ^<X className="h-4 w-4" /^>
echo   ^</ToastPrimitives.Close^>
echo ^)^)
echo ToastClose.displayName = ToastPrimitives.Close.displayName
echo.
echo const ToastTitle = React.forwardRef^<
echo   React.ElementRef^<typeof ToastPrimitives.Title^>,
echo   React.ComponentPropsWithoutRef^<typeof ToastPrimitives.Title^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<ToastPrimitives.Title
echo     ref={ref}
echo     className={cn^("text-sm font-semibold", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo ToastTitle.displayName = ToastPrimitives.Title.displayName
echo.
echo const ToastDescription = React.forwardRef^<
echo   React.ElementRef^<typeof ToastPrimitives.Description^>,
echo   React.ComponentPropsWithoutRef^<typeof ToastPrimitives.Description^>
echo ^>^(^({ className, ...props }, ref^) =^> ^(
echo   ^<ToastPrimitives.Description
echo     ref={ref}
echo     className={cn^("text-sm opacity-90", className^)}
echo     {...props}
echo   /^>
echo ^)^)
echo ToastDescription.displayName = ToastPrimitives.Description.displayName
echo.
echo type ToastProps = React.ComponentPropsWithoutRef^<typeof Toast^>
echo.
echo type ToastActionElement = React.ReactElement^<typeof ToastAction^>
echo.
echo export {
echo   type ToastProps,
echo   type ToastActionElement,
echo   ToastProvider,
echo   ToastViewport,
echo   Toast,
echo   ToastTitle,
echo   ToastDescription,
echo   ToastClose,
echo   ToastAction,
echo }
) > src\components\ui\toast.tsx

REM ===== USE-TOAST HOOK =====
echo. > src\components\ui\use-toast.ts
(
echo import * as React from "react"
echo.
echo import type {
echo   ToastActionElement,
echo   ToastProps,
echo } from "@/components/ui/toast"
echo.
echo const TOAST_LIMIT = 1
echo const TOAST_REMOVE_DELAY = 1000000
echo.
echo type ToasterToast = ToastProps ^& {
echo   id: string
echo   title?: React.ReactNode
echo   description?: React.ReactNode
echo   action?: ToastActionElement
echo }
echo.
echo const actionTypes = {
echo   ADD_TOAST: "ADD_TOAST",
echo   UPDATE_TOAST: "UPDATE_TOAST",
echo   DISMISS_TOAST: "DISMISS_TOAST",
echo   REMOVE_TOAST: "REMOVE_TOAST",
echo } as const
echo.
echo let count = 0
echo.
echo function genId^(^) {
echo   count = ^(count + 1^) %% Number.MAX_SAFE_INTEGER
echo   return count.toString^(^)
echo }
echo.
echo type ActionType = typeof actionTypes
echo.
echo type Action =
echo   ^| {
echo       type: ActionType["ADD_TOAST"]
echo       toast: ToasterToast
echo     }
echo   ^| {
echo       type: ActionType["UPDATE_TOAST"]
echo       toast: Partial^<ToasterToast^>
echo     }
echo   ^| {
echo       type: ActionType["DISMISS_TOAST"]
echo       toastId?: ToasterToast["id"]
echo     }
echo   ^| {
echo       type: ActionType["REMOVE_TOAST"]
echo       toastId?: ToasterToast["id"]
echo     }
echo.
echo interface State {
echo   toasts: ToasterToast[]
echo }
echo.
echo const toastTimeouts = new Map^<string, ReturnType^<typeof setTimeout^>^>^(^)
echo.
echo const addToRemoveQueue = ^(toastId: string^) =^> {
echo   if ^(toastTimeouts.has^(toastId^)^) {
echo     return
echo   }
echo.
echo   const timeout = setTimeout^(^(^) =^> {
echo     toastTimeouts.delete^(toastId^)
echo     dispatch^({
echo       type: "REMOVE_TOAST",
echo       toastId: toastId,
echo     }^)
echo   }, TOAST_REMOVE_DELAY^)
echo.
echo   toastTimeouts.set^(toastId, timeout^)
echo }
echo.
echo export const reducer = ^(state: State, action: Action^): State =^> {
echo   switch ^(action.type^) {
echo     case "ADD_TOAST":
echo       return {
echo         ...state,
echo         toasts: [action.toast, ...state.toasts].slice^(0, TOAST_LIMIT^),
echo       }
echo.
echo     case "UPDATE_TOAST":
echo       return {
echo         ...state,
echo         toasts: state.toasts.map^(^(t^) =^>
echo           t.id === action.toast.id ? { ...t, ...action.toast } : t
echo         ^),
echo       }
echo.
echo     case "DISMISS_TOAST": {
echo       const { toastId } = action
echo.
echo       if ^(toastId^) {
echo         addToRemoveQueue^(toastId^)
echo       } else {
echo         state.toasts.forEach^(^(toast^) =^> {
echo           addToRemoveQueue^(toast.id^)
echo         }^)
echo       }
echo.
echo       return {
echo         ...state,
echo         toasts: state.toasts.map^(^(t^) =^>
echo           t.id === toastId ^|^| toastId === undefined
echo             ? {
echo                 ...t,
echo                 open: false,
echo               }
echo             : t
echo         ^),
echo       }
echo     }
echo     case "REMOVE_TOAST":
echo       if ^(action.toastId === undefined^) {
echo         return {
echo           ...state,
echo           toasts: [],
echo         }
echo       }
echo       return {
echo         ...state,
echo         toasts: state.toasts.filter^(^(t^) =^> t.id !== action.toastId^),
echo       }
echo   }
echo }
echo.
echo const listeners: Array^<^(state: State^) =^> void^> = []
echo.
echo let memoryState: State = { toasts: [] }
echo.
echo function dispatch^(action: Action^) {
echo   memoryState = reducer^(memoryState, action^)
echo   listeners.forEach^(^(listener^) =^> {
echo     listener^(memoryState^)
echo   }^)
echo }
echo.
echo type Toast = Omit^<ToasterToast, "id"^>
echo.
echo function toast^({ ...props }: Toast^) {
echo   const id = genId^(^)
echo.
echo   const update = ^(props: ToasterToast^) =^>
echo     dispatch^({
echo       type: "UPDATE_TOAST",
echo       toast: { ...props, id },
echo     }^)
echo   const dismiss = ^(^) =^> dispatch^({ type: "DISMISS_TOAST", toastId: id }^)
echo.
echo   dispatch^({
echo     type: "ADD_TOAST",
echo     toast: {
echo       ...props,
echo       id,
echo       open: true,
echo       onOpenChange: ^(open^) =^> {
echo         if ^(!open^) dismiss^(^)
echo       },
echo     },
echo   }^)
echo.
echo   return {
echo     id: id,
echo     dismiss,
echo     update,
echo   }
echo }
echo.
echo function useToast^(^) {
echo   const [state, setState] = React.useState^<State^>^(memoryState^)
echo.
echo   React.useEffect^(^(^) =^> {
echo     listeners.push^(setState^)
echo     return ^(^) =^> {
echo       const index = listeners.indexOf^(setState^)
echo       if ^(index ^> -1^) {
echo         listeners.splice^(index, 1^)
echo       }
echo     }
echo   }, []^)
echo.
echo   return {
echo     ...state,
echo     toast,
echo     dismiss: ^(toastId?: string^) =^> dispatch^({ type: "DISMISS_TOAST", toastId }^),
echo   }
echo }
echo.
echo export { useToast, toast }
) > src\components\ui\use-toast.ts

REM ===== TOASTER COMPONENT (ATUALIZADO) =====
echo. > src\components\ui\toaster.tsx
(
echo "use client"
echo.
echo import { useToast } from "@/components/ui/use-toast"
echo import {
echo   Toast,
echo   ToastClose,
echo   ToastDescription,
echo   ToastProvider,
echo   ToastTitle,
echo   ToastViewport,
echo } from "@/components/ui/toast"
echo.
echo export function Toaster^(^) {
echo   const { toasts } = useToast^(^)
echo.
echo   return ^(
echo     ^<ToastProvider^>
echo       {toasts.map^(function ^({ id, title, description, action, ...props }^) {
echo         return ^(
echo           ^<Toast key={id} {...props}^>
echo             ^<div className="grid gap-1"^>
echo               {title ^&^& ^<ToastTitle^>{title}^</ToastTitle^>}
echo               {description ^&^& ^(
echo                 ^<ToastDescription^>{description}^</ToastDescription^>
echo               ^)}
echo             ^</div^>
echo             {action}
echo             ^<ToastClose /^>
echo           ^</Toast^>
echo         ^)
echo       }^)}
echo       ^<ToastViewport /^>
echo     ^</ToastProvider^>
echo   ^)
echo }
) > src\components\ui\toaster.tsx

echo.
echo ===== Componentes Toast criados com sucesso! =====
echo.
echo Agora instale a dependência do toast:
echo npm install @radix-ui/react-toast
echo.
echo Depois execute: npm run dev
echo.