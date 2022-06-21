/*
 * Usage:
 *   const { alert, confirm, prompt } = useModals()
 *   alert({ title: "Hey!", message: "You're great!" }) // awaitable too
 *   if (await confirm({ title: "Do you want kill it?", okText: "Yes kill'em all!" })) ...
 *   const result = await prompt({title: "Enter a URL", "http://" })
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'

const MODALTYPE_ALERT = 'alert'
const MODALTYPE_CONFIRM = 'confirm'
const MODALTYPE_PROMPT = 'prompt'

const defaultContext = {
  alert() {
    throw new Error('<ModalProvider> is missing')
  },
  confirm() {
    throw new Error('<ModalProvider> is missing')
  },
  prompt() {
    throw new Error('<ModalProvider> is missing')
  },
}

const Context = createContext(defaultContext)

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null)
  const input = useRef(null)
  const ok = useRef(null)

  const createOpener = useCallback(
    (type) =>
      ({
        title,
        message,
        okText = 'OK',
        cancelText = 'Cancel',
        defaultValue = ''
      }) =>
        new Promise((resolve) => {
          const handleClose = (e) => {
            e?.preventDefault()
            setModal(null)
            resolve(null)
          }

          const handleCancel = (e) => {
            e?.preventDefault()
            setModal(null)
            if (type === MODALTYPE_PROMPT) resolve(null)
            else resolve(false)
          }

          const handleOK = (e) => {
            e?.preventDefault()
            setModal(null)
            if (type === MODALTYPE_PROMPT) resolve(input.current?.value)
            else resolve(true)
          }

          setModal(
            <Modal
              isOpen={true}
              onClose={handleClose}
              initialFocusRef={type === MODALTYPE_PROMPT ? input : ok}
            >
              <ModalOverlay />
              <ModalContent>
                {title && <ModalHeader>{title}</ModalHeader>}
                <ModalBody mt={5}>
                  <Stack spacing={5}>
                    <Text> {message}</Text>
                    {type === MODALTYPE_PROMPT && (
                      <Input ref={input} defaultValue={defaultValue} />
                    )}
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  {type !== MODALTYPE_ALERT && (
                    <Button mr={3} variant="ghost" onClick={handleCancel}>
                      {cancelText}
                    </Button>
                  )}
                  <Button onClick={handleOK} ref={ok}>
                    {okText}
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )
        }),
    [children]
  )
  ModalProvider.propTypes = {
    ...Context.Provider.propTypes
  }

  return (
    <Context.Provider
      value={{
        alert: createOpener(MODALTYPE_ALERT),
        confirm: createOpener(MODALTYPE_CONFIRM),
        prompt: createOpener(MODALTYPE_PROMPT),
      }}
    >
      {children}
      {modal}
    </Context.Provider>
  )
}

const useModals = () => useContext(Context)

export default useModals