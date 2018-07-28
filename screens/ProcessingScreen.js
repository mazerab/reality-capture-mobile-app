import React from 'react'
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native'

const ProcessingScreen = props => {
  const {
    processing,
    ...attributes
  } = props
  return (
    <Modal
      transparent
      animationType={'none'}
      visible={processing}
      onRequestClose={() => { console.info('close modal.') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={processing} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default ProcessingScreen
