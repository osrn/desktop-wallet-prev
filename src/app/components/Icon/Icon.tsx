// Assets
import React from "react";
import styled from "styled-components";

import { SvgCollection } from "@/app/assets/svg";
import { Size } from "@/types";

type IconProperties = {
	name: string;
	size?: Size;
	as?: React.ElementType;
	fallback?: React.ReactNode;
	dimensions?: [number, number];
} & Omit<React.HTMLProps<any>, "size" | "width" | "height">;

interface WrapperProperties {
	width: number;
	height: number;
}

const Wrapper = styled.div(({ width, height }: WrapperProperties) => ({
	svg: {
		height,
		width,
	},
}));

const getDimensions = (size?: Size, dimensions?: [number, number]): [number, number] => {
	if (dimensions) {
		return dimensions;
	}

	const sizeMap: Record<string, [number, number]> = {
		lg: [20, 20],
		md: [16, 16],
		sm: [10, 10],
		xl: [40, 40],
	};

	return sizeMap[size || "md"];
};

export const Icon: React.VFC<IconProperties> = ({ name, fallback, size, dimensions, ...properties }) => {
	const Svg = SvgCollection[name];

	const [width, height] = getDimensions(size, dimensions);

	return (
		<Wrapper width={width} height={height} {...properties}>
			{Svg ? <Svg /> : fallback}
		</Wrapper>
	);
};
