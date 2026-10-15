import { BRAND_LOGO_SRC, BRAND_NAME } from "../../constants/brand";

type BrandLogoProps = {
    className?: string;
    imageClassName?: string;
    textClassName?: string;
    showText?: boolean;
};

const BrandLogo = ({
    className = "flex items-center gap-2.5",
    imageClassName = "h-8 w-8 object-contain",
    textClassName = "font-bold tracking-tight",
    showText = true,
}: BrandLogoProps) => (
    <div className={className}>
        <img src={BRAND_LOGO_SRC} alt={BRAND_NAME} className={imageClassName} />
        {showText && <span className={textClassName}>{BRAND_NAME}</span>}
    </div>
);

export default BrandLogo;
