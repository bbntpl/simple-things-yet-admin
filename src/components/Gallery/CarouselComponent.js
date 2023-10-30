import React, { useState } from 'react';
import { Carousel, Modal } from 'antd';
// import 'antd/dist/antd.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './index.css';

const styleDefaults = {
	height: 300,
	color: 'white',
	fontSize: 100,
	textAlign: 'center'
};

function CarouselComponent() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	}

	return <div style={{ margin: 24 }}>
		<button onClick={toggleModal}>Click to toggle modal</button>
		<Modal open={isModalOpen}>
			<Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
				<div>
					<h3
						style={{
							backgroundColor: 'red',
							...styleDefaults
						}}
					>
						1
					</h3>
				</div>
				<div>
					<h3 style={{ backgroundColor: 'teal', ...styleDefaults }}>2</h3>
				</div>
				<div>
					<h3 style={{ backgroundColor: 'yellow', ...styleDefaults }}>3</h3>
				</div>
				<div>
					<h3 style={{ backgroundColor: 'blue', ...styleDefaults }}>4</h3>
				</div>
			</Carousel>
		</Modal >
	</div>
}

export default CarouselComponent;