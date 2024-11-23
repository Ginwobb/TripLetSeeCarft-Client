import React from 'react'
import defaultAvatar2 from '../assets/defaultAvatar2.png'
import { DropdownArrow } from '../icons'
export default function Avatar(props){
	const {imgSrc, menu , ...restProps } = props
	return (
		<div className="avatar items-center cursor-pointer">
			<div {...restProps}>
				<img src={imgSrc ?? defaultAvatar2 } />
			</div>
			{ menu && 
					<DropdownArrow className="absolute -bottom-0.5 -right-0.5 w-4 h-4"/>
			}
		</div>
	)
}

