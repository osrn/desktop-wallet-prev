import "swiper/swiper-bundle.css";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Swiper, { Pagination } from "swiper";

Swiper.use([Pagination]);

interface Properties {
	container: string;
	options?: any;
	data?: any;
	paginationPosition: "bottom-center" | "top-right";
}

const defaultOptions = {
	pagination: {
		clickable: true,
		el: ".swiper-pagination",
	},

	roundLengths: true,

	// Custom component options
	slideHeight: 192,

	slidesPerColumn: 1,
	// default slideheight (used for wallet cards),
	// Swiper options
	slidesPerView: 1,
	touchStartPreventDefault: false,
	watchOverflow: true,
};

export const useSlider = ({ container, options, data, paginationPosition }: Properties) => {
	const swiper: any = useRef(null);
	const wrapperReference: any = useRef(null);

	const swiperOptions: any = useMemo(() => {
		const allOptions = { ...defaultOptions, ...options };

		return {
			...allOptions,
			// If items are less or equal than slidesPerView, use 1 row
			slidesPerColumn: data.length <= allOptions.slidesPerView ? 1 : allOptions.slidesPerColumn,
		};
	}, [data, options]);

	const showPagination = useMemo(
		() => data.length > swiperOptions.slidesPerView * swiperOptions.slidesPerColumn,
		[data, swiperOptions],
	);

	// Swiper needs container height to be defined. `slideHeight` is required.
	const containerHeight = useMemo(() => {
		const spacing = 20;
		const shadowOffset = 32;

		const paginationOffset = showPagination && paginationPosition === "bottom-center" ? spacing + 24 : 0;

		return (
			swiperOptions.slidesPerColumn * swiperOptions.slideHeight +
			(data.length > swiperOptions.slidesPerView ? spacing : 0) +
			paginationOffset +
			shadowOffset
		);
	}, [data, paginationPosition, showPagination, swiperOptions]);

	const slideStyles = useMemo(() => {
		const slideStyles: any = { height: `${swiperOptions.slideHeight}px` };
		if (swiperOptions.slidesPerColumn === 1) {
			slideStyles.marginTop = "0";
		}
		return slideStyles;
	}, [swiperOptions]);

	const resetWrapperStyles = useCallback(() => {
		if (wrapperReference?.current?.style) {
			wrapperReference.current.style.width = "auto";
			wrapperReference.current.style.transform = "translate3d(0, 0, 0)";
		}
	}, []);

	useEffect(() => {
		resetWrapperStyles();
		swiper.current = new Swiper(container, swiperOptions);
		return () => {
			if (swiper.current.$el) {
				swiper.current.destroy(true, false);
			}
		};
	}, [container, swiperOptions, data.length, resetWrapperStyles]);

	return { containerHeight, showPagination, slideStyles, swiperOptions, wrapperRef: wrapperReference };
};
