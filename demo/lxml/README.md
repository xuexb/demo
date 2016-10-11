# lxml验证xml

```python
from lxml import etree

xsdfile = etree.parse("./xsd.xml")
xmlschema = etree.XMLSchema(xsdfile)

xmldoc = etree.parse("./card.xml")

print xmlschema.validate(xmldoc)
xmlschema.assertValid(xmldoc)
```