How to develop new templates
```
- Create a new file in src/templates
- Create .stories.tsx file
- Run the command `pnpm storybook`
```

How to expose a new template
```
- Export the new template in src/templates/index
- Add the new template to templatesMap src/bin/generate-pdfs
- Run the command `pnpm generate-pdfs`

The pdf file will be available in the generated-pdfs folder
```



references:
- https://github.com/neves/boleto-barcode-svg/
- https://github.com/zpao/qrcode.react
- https://portal.febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao

