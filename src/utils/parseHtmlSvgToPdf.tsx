export const parseHtmlSvgToPdf = (html: string) => {
	const paths =
		html
			.match(/d="([^"]*)"/g)
			?.map((path) => path.replace('d="', "").replace('"', "")) || [];
	return paths;
};
