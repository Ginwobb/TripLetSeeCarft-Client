import React from 'react'
import { OnlineIcon } from '../icons/index.jsx'
import adminAvatar from '../assets/adminAvatar.png'
export default function AdminAvatar(props){
	const {imgSrc, menu , ...restProps } = props
	return (
		<div className="avatar items-center cursor-pointer">
			<div {...restProps}>
				<img src={imgSrc ?? adminAvatar }/>
			</div>
			{ menu && 
					<OnlineIcon className="absolute -bottom-0.5 -right-0.5 w-4 h-4"/>
			}
		</div>
	)
}

