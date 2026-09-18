# Metadata example setup

Synthetic service-request design for Angola, in pt-AO. The manual creator assignment is an explicit demonstration simplification; confirm the actual team, access and acceptance rules before publication.

`service_reference` is an optional business reference in addition to the native case reference. Keep it only if the service team needs that separate code. Provia allocates it when a case is saved; never enter a default or map a form answer to it. YAML carries its configuration, not a running counter. Import creates a new workflow family.

Select `category` before `service_type` or `deliverables`. For `support`, choose `remote_support` and optionally `diagnosis`. For `maintenance`, choose `preventive` and optionally `inspection`/`maintenance_report`. These are synthetic business classifications, not official Angolan requirements.

The example is a workflow metadata schema. Forms and entity definitions are not included. Configure them separately if the process needs them; verify the form schema's supported features. Verify the destination version supports these fields, then preview both parent branches and a saved generated number in Provia. No destination checks or publication have been performed by the plugin.
