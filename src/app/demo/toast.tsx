'use client'

import type { AriaToastProps, AriaToastRegionProps } from '@react-aria/toast'
import { useToast, useToastRegion } from '@react-aria/toast'
import type { ToastState } from '@react-stately/toast'
import { ToastQueue, useToastQueue } from '@react-stately/toast'
import { AnimatePresence, motion } from 'framer-motion'
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
      <AnimatePresence>
        {state.visibleToasts.map((toast) => (
          <Toast key={toast.key} toast={toast} state={state} />
        ))}
      </AnimatePresence>
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

  const width = 300
  const margin = 16

  return (
    <motion.div
      {...toastProps}
      ref={ref}
      className='flex items-center justify-between gap-4 bg-sky-500 text-white px-4 py-3 rounded'
      layout
      initial={{ x: width + margin }}
      animate={{ x: 0 }}
      exit={{
        opacity: 0,
        zIndex: -1,
        transition: {
          opacity: {
            duration: 0.2,
          },
        },
      }}
      transition={{
        type: 'spring',
        mass: 1,
        damping: 30,
        stiffness: 200,
      }}
      style={{ width, WebkitTapHighlightColor: 'transparent' }}
    >
      <div {...titleProps}>{props.toast.content}</div>
      <button {...btnProps} type='button'>
        x
      </button>
    </motion.div>
  )
}
