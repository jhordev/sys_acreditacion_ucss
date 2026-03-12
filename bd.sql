-- MySQL database export

START TRANSACTION;

CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT NOT NULL,
    `nombre` VARCHAR(255),
    `descripcion` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT NOT NULL,
    `nombre` VARCHAR(255),
    `email` VARCHAR(255),
    `password` VARCHAR(255),
    `estado` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `facultades` (
    `id` BIGINT NOT NULL,
    `nombre` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `sedes` (
    `id` BIGINT NOT NULL,
    `nombre` VARCHAR(255),
    `ciudad` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `programas` (
    `id` BIGINT NOT NULL,
    `id_facultad` BIGINT,
    `nombre` BIGINT,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `programa_sede` (
    `id` BIGINT NOT NULL,
    `id_sede ` BIGINT,
    `id_programa ` BIGINT,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `asignaciones_usuario` (
    `id` BIGINT NOT NULL,
    `id_usuario ` BIGINT,
    `id_rol ` BIGINT,
    `id_programa_sede ` BIGINT,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `estandares` (
    `id` BIGINT NOT NULL,
    `nombre` VARCHAR(255),
    `titulo` VARCHAR(255),
    `descripcion` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `criterios` (
    `id` BIGINT NOT NULL,
    `id_estandar` BIGINT,
    `nombre` VARCHAR(255),
    `descripcion` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `indicadores` (
    `id` BIGINT NOT NULL,
    `codigo` VARCHAR(255),
    `nombre` VARCHAR(255),
    `tipo_dato` VARCHAR(255),
    `objetivo` VARCHAR(255),
    `valor_referencial` DECIMAL,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `evidencias` (
    `id` BIGINT NOT NULL,
    `codigo` VARCHAR(255),
    `descripcion` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `criterio_indicador` (
    `id_criterio` BIGINT NOT NULL,
    `id_indicador` BIGINT,
    PRIMARY KEY (`id_criterio`)
);


CREATE TABLE IF NOT EXISTS `criterio_evidencia` (
    `id_criterio` BIGINT NOT NULL,
    `id_evidencia ` BIGINT,
    PRIMARY KEY (`id_criterio`)
);


CREATE TABLE IF NOT EXISTS `evidencia_items` (
    `id` BIGINT NOT NULL,
    `id_programa_sede ` BIGINT,
    `id_indicador ` BIGINT,
    `id_tipo_item` BIGINT,
    `nombre_item` VARCHAR(255),
    `id_estado` BIGINT,
    `creado_por` BIGINT,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `tipo_item` (
    `id` BIGINT NOT NULL,
    `nombre` VARCHAR(255),
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `estado_item` (
    `id` BIGINT NOT NULL,
    `nombre` BIGINT,
    PRIMARY KEY (`id`)
);


CREATE TABLE IF NOT EXISTS `evidencia_items` (
    `id` BIGINT NOT NULL,
    `id_programa_sede` BIGINT,
    `id_evidencia` BIGINT,
    `nombre_item` VARCHAR(255),
    `id_estado_item` BIGINT,
    PRIMARY KEY (`id`)
);


-- Foreign key constraints

ALTER TABLE `facultades`
ADD CONSTRAINT `fk_facultades_id` FOREIGN KEY(`id`) REFERENCES `programas`(`id_facultad`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `sedes`
ADD CONSTRAINT `fk_sedes_id` FOREIGN KEY(`id`) REFERENCES `programa_sede`(`id_sede `)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `programas`
ADD CONSTRAINT `fk_programas_id` FOREIGN KEY(`id`) REFERENCES `programa_sede`(`id_programa `)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `asignaciones_usuario`
ADD CONSTRAINT `fk_asignaciones_usuario_id_programa_sede ` FOREIGN KEY(`id_programa_sede `) REFERENCES `programa_sede`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `users`
ADD CONSTRAINT `fk_users_id` FOREIGN KEY(`id`) REFERENCES `asignaciones_usuario`(`id_usuario `)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `roles`
ADD CONSTRAINT `fk_roles_id` FOREIGN KEY(`id`) REFERENCES `asignaciones_usuario`(`id_programa_sede `)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `criterios`
ADD CONSTRAINT `fk_criterios_id_estandar` FOREIGN KEY(`id_estandar`) REFERENCES `estandares`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `indicadores`
ADD CONSTRAINT `fk_indicadores_id` FOREIGN KEY(`id`) REFERENCES `criterio_indicador`(`id_indicador`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `criterios`
ADD CONSTRAINT `fk_criterios_id` FOREIGN KEY(`id`) REFERENCES `criterio_indicador`(`id_criterio`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `criterio_evidencia`
ADD CONSTRAINT `fk_criterio_evidencia_id_criterio` FOREIGN KEY(`id_criterio`) REFERENCES `criterios`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `criterio_evidencia`
ADD CONSTRAINT `fk_criterio_evidencia_id_evidencia ` FOREIGN KEY(`id_evidencia `) REFERENCES `evidencias`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `tipo_item`
ADD CONSTRAINT `fk_tipo_item_id` FOREIGN KEY(`id`) REFERENCES `evidencia_items`(`id_tipo_item`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `estado_item`
ADD CONSTRAINT `fk_estado_item_id` FOREIGN KEY(`id`) REFERENCES `evidencia_items`(`id_estado`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `evidencia_items`
ADD CONSTRAINT `fk_evidencia_items_creado_por` FOREIGN KEY(`creado_por`) REFERENCES `users`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `programa_sede`
ADD CONSTRAINT `fk_programa_sede_id` FOREIGN KEY(`id`) REFERENCES `evidencia_items`(`id_programa_sede `)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `evidencia_items`
ADD CONSTRAINT `fk_evidencia_items_id_indicador ` FOREIGN KEY(`id_indicador `) REFERENCES `indicadores`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `estado_item`
ADD CONSTRAINT `fk_estado_item_id` FOREIGN KEY(`id`) REFERENCES `evidencia_items`(`id_estado_item`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `evidencia_items`
ADD CONSTRAINT `fk_evidencia_items_id_programa_sede` FOREIGN KEY(`id_programa_sede`) REFERENCES `programa_sede`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE `evidencia_items`
ADD CONSTRAINT `fk_evidencia_items_id_evidencia` FOREIGN KEY(`id_evidencia`) REFERENCES `evidencias`(`id`)
ON UPDATE CASCADE ON DELETE RESTRICT;

COMMIT;
