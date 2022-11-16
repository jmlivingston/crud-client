import React, { useEffect, useRef } from 'react'

const Modal = ({ children, isOpen, onClose, title }) => {
  const modalRef = useRef()

  useEffect(() => {
    if (isOpen) {
      modalRef.current.showModal()
    } else {
      modalRef.current.close()
    }
  }, [isOpen])

  return (
    <dialog id="view-dialog" ref={modalRef}>
      <form className="w-50" method="dialog">
        <article>
          <header>
            <a aria-label="Close" className="close" onClick={onClose} />
            {title}
          </header>
          {children}
        </article>
      </form>
    </dialog>
  )
}

export default Modal
