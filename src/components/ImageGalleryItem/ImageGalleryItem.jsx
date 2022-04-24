import React from 'react';
// import { Component } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { ImageItem, ImageGalleryItemImage } from './ImageGalleryItem.styled.js';
import Modal from '../Modal';

export default function ImageGalleryItem({
  image: { webformatURL, tags, largeImageURL },
}) {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <ImageItem onClick={toggleModal}>
        <ImageGalleryItemImage src={webformatURL} alt={tags} loading="lazy" />
      </ImageItem>
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageURL} alt={tags} loading="lazy" />
        </Modal>
      )}
    </>
  );
}

// export default class ImageGalleryItem extends Component {
//   state = {
//     showModal: false,
//   };
//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//     }));
//   };
//   render() {
//     const { showModal } = this.state;
//     const {
//       image: { webformatURL, tags, largeImageURL },
//     } = this.props;
//     return (
//       <>
//         <ImageItem onClick={this.toggleModal}>
//           <ImageGalleryItemImage src={webformatURL} alt={tags} loading="lazy" />
//         </ImageItem>
//         {showModal && (
//           <Modal onClose={this.toggleModal}>
//             <img src={largeImageURL} alt={tags} loading="lazy" />
//           </Modal>
//         )}
//       </>
//     );
//   }
// }

ImageGalleryItem.propTypes = {
  webformatURL: PropTypes.string,
  tags: PropTypes.string,
  largeImageURL: PropTypes.string,
  // images: PropTypes.object.isRequired,
};
