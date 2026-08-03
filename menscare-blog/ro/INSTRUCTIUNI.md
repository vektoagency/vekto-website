# MensCare RO — Migrare manuală în temă (fără API)

Tot ce ai nevoie e în această mapă: `c:\Users\yavor\vekto-website\menscare-blog\ro\`

## Pasul 1: Adaugă snippet `product-benefits`

1. Shopify Admin → **Online Store → Themes → Edit code** (pe tema activă)
2. În stânga, derulează la **Snippets** → click **„Add a new snippet"**
3. Nume: `product-benefits` (fără extensie)
4. Click Done
5. Șterge tot conținutul fișierului nou
6. Deschide `product-benefits.liquid` din această mapă, copiază TOT conținutul, lipește în Shopify
7. Click **Save**

## Pasul 2: Adaugă snippet `product-duration`

1. Same place: **Snippets** → **„Add a new snippet"**
2. Nume: `product-duration`
3. Șterge tot conținutul, lipește conținutul din `product-duration.liquid`
4. Click **Save**

## Pasul 3: Modifică `main-product.liquid` (render benefits)

1. În Sections găsește **`main-product.liquid`**
2. Caută (Ctrl+F): `{%- when 'price' -%}`
3. Vei vedea blocul de preț (linii ~133-158 în BG, similar în RO)
4. La sfârșitul blocului price (chiar înainte de `{% when 'clickable_discount' %}` sau `{%- when 'buy_buttons' -%}`), adaugă această linie:

```liquid
              {%- render 'product-benefits', product: product -%}
```

5. Click **Save**

## Pasul 4: Modifică `quantity-breaks.liquid` (duration pill în card-uri)

1. În Snippets → găsește `quantity-breaks.liquid` (există deja, e default)
2. Caută `option_1_caption` (Ctrl+F)
3. Vei vedea 4 blocuri similare pentru option_1, option_2, option_3, option_4
4. La sfârșitul fiecărei căutări, după `</span>` și `{% endif %}` al captionului, DAR ÎNAINTE de `</div>`, adaugă:

```liquid
              {% render 'product-duration', product: product, quantity: block.settings.option_1_quantity %}
```

(schimbă `option_1_quantity` cu `option_2_quantity` la al doilea bloc, etc.)

5. Click **Save**

## Pasul 5: Modifică `product-variant-options.liquid` (duration pe bundle-uri)

1. În Snippets → `product-variant-options.liquid`
2. Caută `{% if caption != blank %}` (Ctrl+F)
3. Înlocuiește blocul:

```liquid
              {% if caption != blank %}
                <span class="quantity-break__caption dynamic-price">
                  {% render 'text-with-price', ... %}
                </span>
              {% endif %}
```

cu:

```liquid
              {% if caption contains 'zilnic' or caption contains 'zile ' or caption contains 'zile,' or caption contains 'zile.' %}
                {% assign caption = '' %}
              {% endif %}
              {% if caption != blank %}
                <span class="quantity-break__caption dynamic-price">
                  {% render 'text-with-price',
                    text: caption,
                    name: value,
                    price: price,
                    compare_price: compare_price,
                    amount_saved: price_difference,
                    amount_saved_rounded: price_difference_rounded
                  %}
                </span>
              {% elsif price_difference > 0 %}
                <span class="quantity-break__caption">
                  Economisești {{ price_difference | money }}
                </span>
              {% endif %}
              {% render 'product-duration', product: product, quantity: forloop.index %}
```

4. Click **Save**

## Verificare

1. Deschide orice product page din store-ul tău
2. Sub preț ar trebui să vezi 3 benefit pills cu icoane
3. La cardurile de cantitate (1x, 2x, 3x), sub caption ar trebui să vezi „Ajunge pentru X zile"

Dacă ceva nu apare, verifică:
- Handle-urile produselor în RO match cu cele din `product-benefits.liquid` (case statement)
- Snippet-ul e salvat

## Promo bar pe pagina păr (opțional, pas suplimentar)

Pentru promo bar HAIR287 echivalent (PAR14 în RO):
- Adaug în următorul update separat dacă vrei.
