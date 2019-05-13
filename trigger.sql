CREATE TRIGGER `people_on_delete` BEFORE DELETE ON `people`
 FOR EACH ROW INSERT INTO people_journal(
	operation, cpf
)

VALUES('update', OLD.id)

CREATE TRIGGER `people_on_insert` AFTER INSERT ON `people`
 FOR EACH ROW INSERT INTO people_journal(
	operation, cpf, name, designation, avatar, mobile, office_ext, office_alt,
    residence_ext, residence_alt, address, email, carrier
)

VALUES( 'insert', NEW.id, NEW.name, NEW.designation, NEW.avatar, NEW.mobile, 
NEW.office_ext, NEW.office_alt, NEW.residence_ext, NEW.residence_alt,
NEW.address, NEW.email, NEW.carrier)

CREATE TRIGGER `people_on_update` AFTER UPDATE ON `people`
 FOR EACH ROW INSERT INTO people_journal(
	operation, cpf, name, designation, avatar, mobile, office_ext, office_alt,
    residence_ext, residence_alt, address, email, carrier
)

VALUES('update', NEW.id, NEW.name, NEW.designation, NEW.avatar, NEW.mobile, 
NEW.office_ext, NEW.office_alt, NEW.residence_ext, NEW.residence_alt,
NEW.address, NEW.email, NEW.carrier)
