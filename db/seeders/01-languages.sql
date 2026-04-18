SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

INSERT INTO languages (languageId, name, repoUrl, type, host) VALUES
('8a9923d3-e28a-436d-a030-62a692c3dbbc', 'Silq', 'https://github.com/silq-lang/silq', 'Procedural', "D"),
('c62158ad-451d-4a12-8857-881f7eac4f6b', 'Qunity', 'https://github.com/mikhailmints/qunity', 'Functional', "OCaml"),
('61e2051d-6ac7-4126-93e6-d512bc300d08', 'Quipper', 'https://github.com/thephoeron/quipper-language', 'Embedded', "Haskell"),
('c1be3149-954c-4529-b710-f4fe979dc4d4', 'RQC++', NULL, NULL, NULL),
('e0c3f423-caba-4d9b-b440-fbf14e572d7d', 'QML', NULL, 'Functional', NULL),
('e5aedc3a-0b59-4834-9eec-08bc2617f5c0', 'qGCL', NULL, NULL, NULL),
('1abc58fc-0274-42f1-9732-a5782d4a5b12', 'Tower', 'https://github.com/psg-mit/tower-oopsla22', 'Procedural', "OCaml"),
('02e1e060-ebca-4fb4-a2fe-9f4a4d90b22a', 'Qiwi', 'https://github.com/Abhinandan-Pal/qiwi', 'Embedded', "Python"),
('a9406d45-8799-466a-a582-677d73402aa7', 'Twist', 'https://github.com/psg-mit/twist-popl22', 'Procedural', "OCaml"),
('a6218b37-2ffc-490c-8ae2-d0dd4ce78e88', 'Q#', 'https://github.com/microsoft/qsharp-compiler', 'Procedural', "C#"),
('84f32d82-9892-4248-8d59-922535dbf8bc', 'Qiskit', 'https://github.com/Qiskit/qiskit', 'Library', "Python"),
('4d666985-9466-4a40-afa8-6c74870d980d', 'Cirq', 'https://github.com/quantumlib/Cirq', 'Library', "Python"),
('30a8cea9-c24b-4706-83aa-eb130561928f', 'tket', 'https://github.com/Quantinuum/tket', 'Library', "Python"),
('bf05777c-4b00-4783-bf38-dcb1259c023c', 'ProjectQ', 'https://github.com/ProjectQ-Framework/ProjectQ', 'Library', "Python"),
('9dc7b338-887a-426f-a754-3e2d7588e121', 'QWire', 'https://github.com/inQWIRE/QWIRE', 'Functional', "Coq"),
('6ec32296-2ab0-488a-a2ea-472a28bb272d', 'Scaffold', 'https://github.com/epiqc/ScaffCC', 'Procedural', "C++"),
('53d2280a-ca72-499c-8c83-a2ab2554c81a', 'pyQuil', 'https://github.com/rigetti/pyquil', 'Library', "Python"),
('58f64449-3a55-4d21-affc-ac7a671763e4', 'QCL', NULL, 'Procedural', NULL),
('0bb97513-fe6f-4980-ac57-af74dded3476', 'QASM', 'https://github.com/openqasm/openqasm', 'Intermediate Representation', 'Python'),
('d2505189-b62a-44a7-a0b1-d64662cc0a35', 'Quantum Control Machine', 'https://github.com/psg-mit/qcm-artifact', 'Intermediate Representation', 'OCaml'),
('841a2d32-ecf8-43f0-96a9-f10d4592e613', 'SQIR', 'https://github.com/inQWIRE/SQIR/', 'Intermediate Representation', 'Coq'),
('0d00e3b6-0530-43a8-8cad-5b413df7e9c1', 'QIR', 'https://github.com/qir-alliance/qir-spec', 'Intermediate Representation', 'LLVM'),
('65aadc12-52f2-4205-b4cd-2e2c7570f089', 'Guppy', 'https://www.quantinuum.com/blog/guppy-programming-the-next-generation-of-quantum-computers', 'Embedded', 'Python');


