/**
 * Img — wrapper que entrega WebP para browsers modernos
 * e cai em PNG/JPG para browsers antigos (ex: Safari < iOS14).
 *
 * Uso:
 *   <Img webp="/image/fundo.webp" fallback="/image/fundo.png" alt="..." />
 *
 * Se a imagem já existir só em um formato, passe apenas `src` normalmente
 * e use <img> diretamente — este componente é para pares webp+fallback.
 */

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  webp: string;
  fallback: string;
  alt: string;
}

export function Img({ webp, fallback, alt, ...rest }: ImgProps) {
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img src={fallback} alt={alt} {...rest} />
    </picture>
  );
}
