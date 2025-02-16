import type * as React from 'react'
import type { VariantProps } from 'class-variance-authority'

declare global {
  namespace React {
    interface ReactElement {
      type: any
      props: any
      key: string | null
    }
  }
}

export type OmitRef<T> = Omit<T, 'ref'>

export type HTMLAttributes<T> = React.DetailedHTMLProps<
  React.HTMLAttributes<T>,
  T
>

export type ButtonHTMLAttributes<T> = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<T>,
  T
>

export type InputHTMLAttributes<T> = React.DetailedHTMLProps<
  React.InputHTMLAttributes<T>,
  T
>

export type FormHTMLAttributes<T> = React.DetailedHTMLProps<
  React.FormHTMLAttributes<T>,
  T
>

export type ComponentWithRef<T, P> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>