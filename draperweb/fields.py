from collections import OrderedDict

from rest_framework import serializers


class RelatedModelField(serializers.PrimaryKeyRelatedField):
    """
    Related model field.
    - uses primary key for write (like base)
    - returns a serialized model on read (instead of pk, like base)
    """

    def __init__(self, serializer, **kwargs):
        self.serializer = serializer
        super(RelatedModelField, self).__init__(**kwargs)

    def use_pk_only_optimization(self):
        return False

    def to_representation(self, value):
        return self.serializer(instance=value, context=self.context).data

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            # Ensure that field.choices returns something sensible
            # even when accessed with a read-only field.
            return {}

        if cutoff is not None:
            queryset = queryset[:cutoff]

        return OrderedDict(
            [
                (
                    item.pk,  # NB: We can't use `to_representation` like PrimaryKeyRelatedField
                    self.display_value(item),
                )
                for item in queryset
            ]
        )
