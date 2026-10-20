# Project catalogues

Run `python scripts/generate-catalogues.py` with Python 3, ReportLab and Pillow installed, plus Node and this repository's dependencies.

The generator reads all six current project records, finish options, per-project `tierPriceLabel` values and contact details from the website's TypeScript sources via `catalogue-data.mjs`. Homepage starting prices are intentionally independent. It writes the published PDFs to `public/catalogs/` and updates `src/lib/data/catalogues.json`, which supplies the download UI's page counts and file sizes.

Run it whenever catalogue content changes. Review the resulting PDFs before publishing. Project-local images are embedded from `public/images/projects/`. Remaining remote website reference images are downloaded to a temporary cache and clearly labelled as references in the PDF. They are not represented as actual project photographs.

The catalogue intentionally does not reproduce the generic illustrative floor plans, default specification list, unverified route distances or placeholder registration number. Buyers are directed to request the approved drawings, home-specific area statement and written specification/quotation.
