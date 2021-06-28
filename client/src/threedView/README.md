# ThreedView

Currently the 3D scene rendered is not reactive.

This means that the changes made to the scene are not guaranteed to update parts of the UI. The scene is created and stored in the store under `scene`. All parts of the react-client then uses `store.scene` to pull objects related to the scene. Hence, changes made will be made in the store object, but do not trigger updates to the UI. The consumers should be manually updated.
