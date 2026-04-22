from django import template

register = template.Library()


@register.filter
def trim(value):
    """Strip whitespace from a string."""
    if isinstance(value, str):
        return value.strip()
    return value
