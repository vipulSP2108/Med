import React, { useState } from 'react';

const PopUpLang = () => {
  const [Openmodal, setOpenmodal] = useState(false);

  const renderModal = () => {
    // Your modal rendering logic here
    return (
      Openmodal && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={Openmodal}
          onRequestClose={() => setOpenmodal(false)}
        >
          <View style={styles.modalContainer}>
            <Text>Modal Content</Text>
            <Button title="Close" onPress={() => setOpenmodal(false)} />
          </View>
        </Modal>
      )
    );
  };

  return { Openmodal, setOpenmodal, renderModal };
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}

export default PopUpLang;