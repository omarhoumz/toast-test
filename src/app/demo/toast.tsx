'use client'

import type { AriaToastProps, AriaToastRegionProps } from '@react-aria/toast'
import { useToast, useToastRegion } from '@react-aria/toast'
import type { ToastState } from '@react-stately/toast'
import { ToastQueue, useToastQueue } from '@react-stately/toast'
import { useRef } from 'react'
import { createPortal } from 'react-dom'

export const toastQueue = new ToastQueue({ maxVisibleToasts: 5 })

interface ToastRegionProps<T> extends AriaToastRegionProps {
  state: ToastState<T>
}

interface ToastProps<T> extends AriaToastProps<T> {
  state: ToastState<T>
}

export function GlobalToastRegion(props) {
  const state = useToastQueue(toastQueue)

  return state.visibleToasts.length > 0
    ? createPortal(<ToastRegion {...props} state={state} />, document.body)
    : null
}

function ToastRegion<T extends React.ReactNode>({
  state,
  ...props
}: ToastRegionProps<T>) {
  const ref = useRef(null)
  const { regionProps } = useToastRegion(props, state, ref)

  return (
    <div
      {...regionProps}
      ref={ref}
      className='fixed top-4 right-4 flex gap-2 flex-col-reverse'
    >
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>
  )
}

function Toast<T extends React.ReactNode>({ state, ...props }: ToastProps<T>) {
  const ref = useRef(null)
  const {
    toastProps,
    titleProps,
    closeButtonProps: { onPress, ...otherProps },
  } = useToast(props, state, ref)

  const btnProps = { ...otherProps, onClick: onPress }

  return (
    <div
      {...toastProps}
      ref={ref}
      className='flex items-center gap-4 bg-sky-500 text-white px-4 py-3 rounded data-[animation=entering]:animate-slideIn data-[animation=queued]:animate-fadeIn data-[animation=exiting]:animate-slideOut data-[animation=exiting]:fixed data-[animation=exiting]:right-4 data-[animation=exiting]:pointer-events-none min-w-[300px] justify-between'
      // Use a data attribute to trigger animations in CSS.
      data-animation={props.toast.animation}
      onAnimationEnd={() => {
        // Remove the toast when the exiting animation completes.
        if (props.toast.animation === 'exiting') {
          state.remove(props.toast.key)
        }
      }}
    >
      <div {...titleProps}>{props.toast.content}</div>
      <button {...btnProps} type='button'>
        x
      </button>
    </div>
  )
}
