import React from 'react'
import { Box, FormControl, FormLabel, FormHelperText,  Stack, VStack, Button, Divider } from '@chakra-ui/react'
import { mdiClipboardOutline, mdiContentSaveOutline, mdiImage, mdiImageSearchOutline } from '@mdi/js'

import { useAppState } from '../../AppState'
import { SHOW_ORIGINAL, SHOW_PREVIEW } from '../../constants'
import { useCopyProcessedImageToClipboard, useDownloadProcessedImageToFile } from '../../hooks/useSaveProcessedImage'
import useUpdateProcessedImage from '../../hooks/useUpdateProcessedImage'
import Icon from '../Icon'
import RadioButton from './RadioButton'
import RadioButtons from './RadioButtons'
import Tooltip from '../Tooltip'
import ColorInput from './ColorInput'

const styles = {
  root: {
    minWidth: 200,
    maxWidth: ['auto', 280],
    padding: 5,
    borderLeftWidth: 1,
    overflowY: 'scroll',
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: 'teal.600',
    color: 'white',
    _hover: {
      backgroundColor: 'teal.600',
    },
    _active: {
      backgroundColor: 'teal.500',
    },
  },
}

const SettingsForm = (props) => {
  const [state, updateState] = useAppState()
  const updateProcessedImage = useUpdateProcessedImage()

  const updateStateValue = (key, value) => {
    if(value instanceof Event) {
      value = value.target.value
    }

    updateState((draft) => {
      draft[key] = value
    })

    if(key === 'transparentizeColor' || key === 'solidifyColor') {
      updateProcessedImage()
    }
  }

  const copyProcessedImageToClipboard = useCopyProcessedImageToClipboard()
  const downloadProcessedImageToFile = useDownloadProcessedImageToFile()

  return (
    <VStack
      id='SettingsForm'
      spacing={6}
      {...styles.root}
      {...props}
    >

      <FormControl>
        <FormLabel>Show</FormLabel>
        {/* <RadioGroup */}
        <RadioButtons
          value={state.show}
          onChange={updateStateValue.bind(null, 'show')}
          disabled={state.isBusy}
        >
          <RadioButton
            value={SHOW_ORIGINAL}
            icon={<Icon path={mdiImage} />}
          >
              Original
          </RadioButton>
          <RadioButton
            value={SHOW_PREVIEW}
            icon={<Icon path={mdiImageSearchOutline} />}
          >
              Preview
          </RadioButton>

        </RadioButtons>
        {/* </RadioGroup> */}
      </FormControl>

      <Divider />

      <FormControl>
        <Stack direction="row" spacing={3}>
          <ColorInput
            name="transparentizeColor"
            onChange={ updateStateValue.bind(null, 'transparentizeColor') }
          />
          <FormLabel htmlFor='transparentizeColor' mb={0}>
            Background Color
          </FormLabel>
        </Stack>
        <FormHelperText mt={0.5}>the color to subtract from the image to transparentize it</FormHelperText>
      </FormControl>

      <FormControl>
        <Stack direction="row" spacing={3}>
          <ColorInput
            name="solidifyColor"
            onChange={ updateStateValue.bind(null, 'solidifyColor') }
          />
          <FormLabel
            htmlFor='solidifyColor'
            mb={0}
            fontSize="md"
          >
            Solidify Color
          </FormLabel>
        </Stack>
        <FormHelperText my={0.5}>the color to subtract from the image to transparentize it</FormHelperText>
      </FormControl>

      <Divider />

      <VStack spacing={3} alignItems="flex-start"  >

        <FormLabel
          htmlFor='solidifyColor'
          mb={0}
          fontSize="md"
          disabled={!state.isLoaded || state.isBusy}
        >
          Save to
        </FormLabel>

        <Tooltip
          label="Copy the transparentized image to the clipboard"
          keyBinding='mod c'
        >
          <Button
            disabled={!state.isLoaded || state.isBusy}
            onClick={copyProcessedImageToClipboard}
            marginTop={1}
            {...styles.button}
            size="md"
          >
            <Icon
              path={mdiClipboardOutline}
              size={1}
              mr={2}
            />
            Clipboard
          </Button>
        </Tooltip>

        <Tooltip
          label="Download the transparentized image as .png image file"
          keyBinding='mod s'
        >
          <Button
            marginTop={1}
            disabled={!state.isLoaded || state.isBusy}
            onClick={downloadProcessedImageToFile}
            {...styles.button}
            size="md"
          >
            <Icon
              path={mdiContentSaveOutline}
              size={1}
              mr={2}
            />
            File
          </Button>
        </Tooltip>
      </VStack>


    </VStack>
  )
}

SettingsForm.propTypes = {
  ...Box.propTypes,
}

export default SettingsForm